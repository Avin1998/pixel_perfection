import express from 'express';
import { ImageComparisonService } from '../services/imageComparison';
import { upload } from '../utils/upload';

const router = express.Router();
const comparisonService = new ImageComparisonService();

/**
 * Compare two uploaded images
 */
router.post('/images', upload.fields([
  { name: 'designImage', maxCount: 1 },
  { name: 'implementationImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { options } = req.body;

    if (!files.designImage || !files.implementationImage) {
      return res.status(400).json({
        error: 'Both design and implementation images are required'
      });
    }

    const designImagePath = files.designImage[0].path;
    const implementationImagePath = files.implementationImage[0].path;

    // Parse options if provided
    let comparisonOptions = {};
    if (options) {
      try {
        comparisonOptions = JSON.parse(options);
      } catch (e) {
        console.warn('Invalid options JSON:', options);
      }
    }

    const result = await comparisonService.compareImages(
      designImagePath,
      implementationImagePath,
      comparisonOptions
    );

    // Convert file paths to relative URLs for the client
    result.images.design = `/uploads/${files.designImage[0].filename}`;
    result.images.implementation = `/uploads/${files.implementationImage[0].filename}`;
    result.images.diff = result.images.diff.replace(
      /.*\/temp\//, 
      '/temp/'
    );
    
    if (result.images.overlay) {
      result.images.overlay = result.images.overlay.replace(
        /.*\/temp\//, 
        '/temp/'
      );
    }

    res.json(result);

  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      error: 'Failed to compare images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Compare design image with a live URL screenshot
 */
router.post('/url', upload.single('designImage'), async (req, res) => {
  try {
    const { url, options } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        error: 'Design image is required'
      });
    }

    if (!url) {
      return res.status(400).json({
        error: 'URL is required'
      });
    }

    // TODO: Implement screenshot capture with Puppeteer
    // For now, return a placeholder response
    res.status(501).json({
      error: 'URL comparison not yet implemented',
      message: 'Screenshot capture functionality will be added in the next iteration'
    });

  } catch (error) {
    console.error('URL comparison error:', error);
    res.status(500).json({
      error: 'Failed to compare with URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get comparison history
 */
router.get('/history', async (req, res) => {
  try {
    // TODO: Implement comparison history storage
    res.json({
      message: 'History feature will be implemented in future iteration',
      comparisons: []
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Delete comparison and cleanup files
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await comparisonService.cleanup(id);
    
    res.json({
      message: 'Comparison deleted successfully'
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      error: 'Failed to delete comparison',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as comparisonRoutes };