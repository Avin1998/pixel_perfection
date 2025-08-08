import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ComparisonOptions, ComparisonResult, Mismatch } from '../types';

export class ImageComparisonService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDirectory();
  }

  private ensureTempDirectory(): void {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Compare two images and return detailed comparison results
   */
  async compareImages(
    designImagePath: string,
    implementationImagePath: string,
    options: ComparisonOptions = {}
  ): Promise<ComparisonResult> {
    const id = uuidv4();
    const timestamp = new Date();

    try {
      // Load and normalize images
      const { img1, img2, width, height } = await this.loadAndNormalizeImages(
        designImagePath,
        implementationImagePath
      );

      // Create diff image
      const diff = new PNG({ width, height });
      
      const threshold = options.threshold || 0.1;
      const includeAA = options.includeAA || false;
      const alpha = options.alpha || 0.1;

      // Perform pixel-by-pixel comparison
      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        {
          threshold,
          includeAA,
          alpha,
          diffMask: options.diffMask
        }
      );

      // Save diff image
      const diffImagePath = path.join(this.tempDir, `diff-${id}.png`);
      const diffBuffer = PNG.sync.write(diff);
      fs.writeFileSync(diffImagePath, diffBuffer);

      // Calculate statistics
      const totalPixels = width * height;
      const percentDifferent = (numDiffPixels / totalPixels) * 100;
      const overallScore = Math.max(0, 100 - percentDifferent);

      // Analyze mismatches (basic implementation)
      const mismatches = await this.analyzeMismatches(img1, img2, diff, width, height);

      // Generate overlay image (optional)
      let overlayImagePath: string | undefined;
      if (options.diffMask) {
        overlayImagePath = await this.createOverlayImage(
          designImagePath,
          diffImagePath,
          id
        );
      }

      return {
        id,
        timestamp,
        summary: {
          totalPixels,
          differentPixels: numDiffPixels,
          percentDifferent: Math.round(percentDifferent * 100) / 100,
          overallScore: Math.round(overallScore * 100) / 100
        },
        images: {
          design: designImagePath,
          implementation: implementationImagePath,
          diff: diffImagePath,
          overlay: overlayImagePath
        },
        mismatches,
        suggestions: this.generateSuggestions(mismatches, percentDifferent)
      };

    } catch (error) {
      console.error('Image comparison error:', error);
      throw new Error(`Failed to compare images: ${error}`);
    }
  }

  /**
   * Load and normalize two images to the same dimensions
   */
  private async loadAndNormalizeImages(
    imagePath1: string,
    imagePath2: string
  ): Promise<{ img1: PNG; img2: PNG; width: number; height: number }> {
    
    // Get image metadata
    const meta1 = await sharp(imagePath1).metadata();
    const meta2 = await sharp(imagePath2).metadata();

    // Determine target dimensions (use larger of the two)
    const width = Math.max(meta1.width || 0, meta2.width || 0);
    const height = Math.max(meta1.height || 0, meta2.height || 0);

    // Resize and convert to PNG buffers
    const buffer1 = await sharp(imagePath1)
      .resize(width, height, { 
        fit: 'contain', 
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();

    const buffer2 = await sharp(imagePath2)
      .resize(width, height, { 
        fit: 'contain', 
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Parse PNG data
    const img1 = PNG.sync.read(buffer1);
    const img2 = PNG.sync.read(buffer2);

    return { img1, img2, width, height };
  }

  /**
   * Analyze the diff image to identify specific types of mismatches
   */
  private async analyzeMismatches(
    img1: PNG,
    img2: PNG,
    diff: PNG,
    width: number,
    height: number
  ): Promise<Mismatch[]> {
    const mismatches: Mismatch[] = [];
    
    // Basic implementation - find clusters of different pixels
    const visited = new Set<string>();
    const diffPixels: Array<{x: number, y: number}> = [];

    // Find all different pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        // Check if this pixel is marked as different (red in diff image)
        if (diff.data[idx] > 200 && diff.data[idx + 1] < 50 && diff.data[idx + 2] < 50) {
          diffPixels.push({ x, y });
        }
      }
    }

    // Group nearby pixels into regions
    const regions = this.groupPixelsIntoRegions(diffPixels, 10);

    // Analyze each region
    for (const region of regions) {
      if (region.length < 10) continue; // Skip small regions

      const bounds = this.getRegionBounds(region);
      const mismatch: Mismatch = {
        type: 'visual', // Default type, could be enhanced with more analysis
        severity: this.calculateSeverity(region.length, width * height),
        description: `Visual difference detected in region`,
        location: bounds,
        suggestion: 'Review the highlighted area for potential layout or styling issues'
      };

      mismatches.push(mismatch);
    }

    return mismatches;
  }

  /**
   * Group nearby pixels into regions
   */
  private groupPixelsIntoRegions(
    pixels: Array<{x: number, y: number}>, 
    maxDistance: number
  ): Array<Array<{x: number, y: number}>> {
    const regions: Array<Array<{x: number, y: number}>> = [];
    const visited = new Set<string>();

    for (const pixel of pixels) {
      const key = `${pixel.x},${pixel.y}`;
      if (visited.has(key)) continue;

      const region: Array<{x: number, y: number}> = [];
      const queue = [pixel];
      visited.add(key);

      while (queue.length > 0) {
        const current = queue.shift()!;
        region.push(current);

        // Find nearby pixels
        for (const candidate of pixels) {
          const candidateKey = `${candidate.x},${candidate.y}`;
          if (visited.has(candidateKey)) continue;

          const distance = Math.sqrt(
            Math.pow(current.x - candidate.x, 2) + 
            Math.pow(current.y - candidate.y, 2)
          );

          if (distance <= maxDistance) {
            visited.add(candidateKey);
            queue.push(candidate);
          }
        }
      }

      if (region.length > 0) {
        regions.push(region);
      }
    }

    return regions;
  }

  /**
   * Get bounding box for a region of pixels
   */
  private getRegionBounds(region: Array<{x: number, y: number}>): {
    x: number; y: number; width: number; height: number;
  } {
    const xs = region.map(p => p.x);
    const ys = region.map(p => p.y);
    
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
  }

  /**
   * Calculate severity based on region size
   */
  private calculateSeverity(regionSize: number, totalPixels: number): 'low' | 'medium' | 'high' | 'critical' {
    const percentage = (regionSize / totalPixels) * 100;
    
    if (percentage > 5) return 'critical';
    if (percentage > 2) return 'high';
    if (percentage > 0.5) return 'medium';
    return 'low';
  }

  /**
   * Create an overlay image showing differences on the original
   */
  private async createOverlayImage(
    originalImagePath: string,
    diffImagePath: string,
    id: string
  ): Promise<string> {
    const overlayPath = path.join(this.tempDir, `overlay-${id}.png`);
    
    await sharp(originalImagePath)
      .composite([{
        input: diffImagePath,
        blend: 'multiply'
      }])
      .png()
      .toFile(overlayPath);

    return overlayPath;
  }

  /**
   * Generate actionable suggestions based on mismatches
   */
  private generateSuggestions(mismatches: Mismatch[], percentDifferent: number): string[] {
    const suggestions: string[] = [];

    if (percentDifferent > 20) {
      suggestions.push('Large visual differences detected. Consider reviewing the overall layout and structure.');
    }

    if (percentDifferent > 5 && percentDifferent <= 20) {
      suggestions.push('Moderate differences found. Check for spacing, padding, or alignment issues.');
    }

    if (percentDifferent <= 5 && percentDifferent > 1) {
      suggestions.push('Minor differences detected. Review fine details like borders, shadows, or font rendering.');
    }

    const criticalMismatches = mismatches.filter(m => m.severity === 'critical');
    if (criticalMismatches.length > 0) {
      suggestions.push(`${criticalMismatches.length} critical issues found. These should be addressed first.`);
    }

    if (suggestions.length === 0) {
      suggestions.push('Images are very similar. Great job on the implementation!');
    }

    return suggestions;
  }

  /**
   * Clean up temporary files
   */
  async cleanup(comparisonId: string): Promise<void> {
    const files = [
      `diff-${comparisonId}.png`,
      `overlay-${comparisonId}.png`
    ];

    for (const file of files) {
      const filePath = path.join(this.tempDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
}