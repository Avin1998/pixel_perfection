import React from 'react';
import './App.css';

// Interface for future use
// interface ComparisonResult {
//   id: string;
//   summary: {
//     overallScore: number;
//     percentDifferent: number;
//     differentPixels: number;
//     totalPixels: number;
//   };
//   images: {
//     design: string;
//     implementation: string;
//     diff: string;
//   };
// }

function App() {
  // Placeholder for future state management
  // const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            🎨 Pixel Perfection Tool
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Compare your designs with implementations for pixel-perfect results
          </p>
        </div>
      </header>
      
      <main className="container" style={{ padding: '2rem 0' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Upload Your Files to Get Started
          </h2>
          <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            This tool will compare your design files with implementation screenshots and provide detailed analysis.
            Upload functionality and comparison features will be available once the backend is running.
          </p>
        </div>

        <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Backend Setup Required
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              To use the comparison features, please start the backend server first:
            </p>
            <div style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#374151',
              marginBottom: '2rem'
            }}>
              <div>cd server</div>
              <div>npm run dev</div>
            </div>
            <div style={{ 
              background: '#dbeafe', 
              border: '1px solid #93c5fd',
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#1e40af'
            }}>
              <strong>Features included:</strong>
              <ul style={{ textAlign: 'left', margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                <li>Image upload and comparison</li>
                <li>Pixel-level difference detection</li>
                <li>Visual overlay generation</li>
                <li>Detailed mismatch analysis</li>
                <li>Actionable suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ background: 'white', borderTop: '1px solid #e5e7eb', marginTop: '4rem', padding: '2rem 0' }}>
        <div className="container text-center">
          <p style={{ color: '#6b7280', margin: 0 }}>
            &copy; 2024 Pixel Perfection Tool. Built for designers and developers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
