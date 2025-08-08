export interface ComparisonResult {
  id: string;
  timestamp: Date;
  summary: {
    totalPixels: number;
    differentPixels: number;
    percentDifferent: number;
    overallScore: number;
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

export interface ComparisonOptions {
  threshold?: number;
  includeAA?: boolean;
  alpha?: number;
  diffMask?: boolean;
}

export interface UploadSectionProps {
  onComparisonStart: () => void;
  onComparisonComplete: (result: ComparisonResult) => void;
}

export interface ComparisonResultsProps {
  result: ComparisonResult;
  onNewComparison: () => void;
}