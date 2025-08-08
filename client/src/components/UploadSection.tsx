import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadSectionProps, ComparisonOptions } from '../types';
import { comparisonService } from '../services/comparisonService';

export const UploadSection: React.FC<UploadSectionProps> = ({
  onComparisonStart,
  onComparisonComplete
}) => {
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [implementationFile, setImplementationFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ComparisonOptions>({
    threshold: 0.1,
    includeAA: false,
    alpha: 0.1,
    diffMask: true
  });
  const [error, setError] = useState<string | null>(null);

  const onDesignDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDesignFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const onImplementationDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImplementationFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const {
    getRootProps: getDesignRootProps,
    getInputProps: getDesignInputProps,
    isDragActive: isDesignDragActive
  } = useDropzone({
    onDrop: onDesignDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  const {
    getRootProps: getImplRootProps,
    getInputProps: getImplInputProps,
    isDragActive: isImplDragActive
  } = useDropzone({
    onDrop: onImplementationDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  const handleCompare = async () => {
    if (!designFile || !implementationFile) {
      setError('Please upload both design and implementation images');
      return;
    }

    try {
      setError(null);
      onComparisonStart();
      
      const result = await comparisonService.compareImages(
        designFile,
        implementationFile,
        options
      );
      
      onComparisonComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
      onComparisonComplete(null as any); // Reset loading state
    }
  };

  const removeDesignFile = () => {
    setDesignFile(null);
    setError(null);
  };

  const removeImplementationFile = () => {
    setImplementationFile(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Compare Your Design with Implementation
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your design file and implementation screenshot to get detailed analysis 
          of visual differences, mismatches, and actionable suggestions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Design Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Design File</h3>
          <div
            {...getDesignRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDesignDragActive
                ? 'border-primary-500 bg-primary-50'
                : designFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getDesignInputProps()} />
            {designFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{designFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(designFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDesignFile();
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop design file here
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                  <p className="text-sm text-gray-400 mt-2">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Implementation Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Implementation Screenshot</h3>
          <div
            {...getImplRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isImplDragActive
                ? 'border-primary-500 bg-primary-50'
                : implementationFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getImplInputProps()} />
            {implementationFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{implementationFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(implementationFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImplementationFile();
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop implementation here
                  </p>
                  <p className="text-gray-500">or click to browse</p>
                  <p className="text-sm text-gray-400 mt-2">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Options</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-2">
              Sensitivity Threshold
            </label>
            <input
              type="range"
              id="threshold"
              min="0"
              max="1"
              step="0.01"
              value={options.threshold}
              onChange={(e) => setOptions({...options, threshold: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>More sensitive</span>
              <span>{options.threshold}</span>
              <span>Less sensitive</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="alpha" className="block text-sm font-medium text-gray-700 mb-2">
              Diff Opacity
            </label>
            <input
              type="range"
              id="alpha"
              min="0"
              max="1"
              step="0.01"
              value={options.alpha}
              onChange={(e) => setOptions({...options, alpha: parseFloat(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Transparent</span>
              <span>{options.alpha}</span>
              <span>Opaque</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.includeAA}
              onChange={(e) => setOptions({...options, includeAA: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include anti-aliasing differences</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.diffMask}
              onChange={(e) => setOptions({...options, diffMask: e.target.checked})}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Generate overlay visualization</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compare Button */}
      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={!designFile || !implementationFile}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
            designFile && implementationFile
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Compare Images
        </button>
        
        {designFile && implementationFile && (
          <p className="mt-2 text-sm text-gray-600">
            Ready to compare • This may take a few moments
          </p>
        )}
      </div>
    </div>
  );
};