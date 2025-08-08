export interface ComparisonRequest {
  designImage: string; // base64 or file path
  implementationImage?: string; // base64 or file path
  implementationUrl?: string;
  options?: ComparisonOptions;
}

export interface ComparisonOptions {
  threshold?: number; // 0-1, similarity threshold
  includeAA?: boolean; // Include anti-aliasing in comparison
  alpha?: number; // Alpha blending factor
  diffMask?: boolean; // Generate diff mask
}

export interface ComparisonResult {
  id: string;
  timestamp: Date;
  summary: {
    totalPixels: number;
    differentPixels: number;
    percentDifferent: number;
    overallScore: number; // 0-100, higher is more similar
  };
  images: {
    design: string;
    implementation: string;
    diff: string;
    overlay?: string;
  };
  mismatches: Mismatch[];
  suggestions?: string[];
}

export interface Mismatch {
  type: 'spacing' | 'size' | 'color' | 'typography' | 'position' | 'visual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  expected?: any;
  actual?: any;
  suggestion?: string;
}

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  fullPage?: boolean;
  selector?: string;
}

export interface CSSProperty {
  property: string;
  value: string;
  computed: string;
}

export interface ElementStyles {
  selector: string;
  properties: CSSProperty[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}