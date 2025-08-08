import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pixel Perfection</h1>
              <p className="text-sm text-gray-600">Compare designs with implementations</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Supported:</span> PNG, JPG, WebP
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">How it works:</span> Upload your design file and implementation screenshot to get detailed visual comparison analysis with actionable insights.
          </p>
        </div>
      </div>
    </header>
  );
};