import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-jarvis-dark">
      <div className="glass-panel p-8 rounded-lg border border-red-500/30 max-w-md mx-4">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">System Error Detected</h2>
          <p className="text-gray-300 mb-6">
            An unexpected error occurred in the quantum matrix. Our AI systems are working to resolve this issue.
          </p>
          <details className="text-left mb-6">
            <summary className="text-jarvis-cyan cursor-pointer hover:text-jarvis-blue transition-colors">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-gray-400 bg-black/30 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
          <button
            onClick={resetErrorBoundary}
            className="glow-button px-6 py-3 text-lg font-semibold"
          >
            Reinitialize System
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Here you could send error reports to a logging service
      }}
      onReset={() => {
        // Optionally clear any error state or reload the page
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;

