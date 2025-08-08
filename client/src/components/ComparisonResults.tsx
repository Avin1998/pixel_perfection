import React, { useState } from 'react';
import { ComparisonResultsProps } from '../types';

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  result,
  onNewComparison
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'suggestions'>('overview');
  const [selectedImage, setSelectedImage] = useState<'design' | 'implementation' | 'diff' | 'overlay'>('diff');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderImageViewer = () => {
    const imageMap = {
      design: { src: result.images.design, label: 'Original Design' },
      implementation: { src: result.images.implementation, label: 'Implementation' },
      diff: { src: result.images.diff, label: 'Differences' },
      overlay: { src: result.images.overlay, label: 'Overlay' }
    };

    const currentImage = imageMap[selectedImage];
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <div className="flex space-x-1">
            {Object.entries(imageMap).map(([key, { label }]) => {
              if (key === 'overlay' && !result.images.overlay) return null;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedImage(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedImage === key
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentImage.label}
            </h3>
            {currentImage.src ? (
              <img
                src={`http://localhost:3001${currentImage.src}`}
                alt={currentImage.label}
                className="max-w-full h-auto mx-auto rounded-lg shadow-sm border border-gray-200"
                style={{ maxHeight: '600px' }}
              />
            ) : (
              <div className="text-gray-500 py-12">
                Image not available
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Comparison Results</h2>
          <p className="text-gray-600 mt-1">
            Analysis completed on {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onNewComparison}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          New Comparison
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.summary.overallScore)}`}>
              {result.summary.overallScore.toFixed(1)}% Match
            </div>
            <p className="text-gray-600 text-sm mt-2">Overall Similarity</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {result.summary.percentDifferent.toFixed(2)}%
            </div>
            <p className="text-gray-600 text-sm">Pixels Different</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {result.mismatches.length}
            </div>
            <p className="text-gray-600 text-sm">Issues Found</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {result.mismatches.filter(m => m.severity === 'critical' || m.severity === 'high').length}
            </div>
            <p className="text-gray-600 text-sm">High Priority</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Visual Overview' },
            { key: 'detailed', label: 'Detailed Analysis' },
            { key: 'suggestions', label: 'Suggestions' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {renderImageViewer()}
          </div>
          
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pixels:</span>
                  <span className="font-medium">{result.summary.totalPixels.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Different Pixels:</span>
                  <span className="font-medium">{result.summary.differentPixels.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Similarity Score:</span>
                  <span className={`font-medium ${result.summary.overallScore >= 80 ? 'text-green-600' : result.summary.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.summary.overallScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Top Issues */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issues</h3>
              {result.mismatches.length > 0 ? (
                <div className="space-y-3">
                  {result.mismatches.slice(0, 5).map((mismatch, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(mismatch.severity)}`}>
                        {mismatch.severity}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{mismatch.description}</p>
                        {mismatch.suggestion && (
                          <p className="text-xs text-gray-600 mt-1">{mismatch.suggestion}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No significant issues detected!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analysis</h3>
          {result.mismatches.length > 0 ? (
            <div className="space-y-4">
              {result.mismatches.map((mismatch, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(mismatch.severity)}`}>
                        {mismatch.severity}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {mismatch.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Position: {mismatch.location.x}, {mismatch.location.y} 
                      • Size: {mismatch.location.width}×{mismatch.location.height}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{mismatch.description}</h4>
                  
                  {mismatch.suggestion && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Suggestion:</span> {mismatch.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">Excellent match!</p>
              <p className="text-gray-600">No significant issues were detected in your implementation.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actionable Suggestions</h3>
          {result.suggestions && result.suggestions.length > 0 ? (
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No specific suggestions at this time.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};