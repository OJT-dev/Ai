import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isNetworkError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isNetworkError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if it's a network error
    const isNetworkError = error.message.toLowerCase().includes('network') || 
                          error.message.toLowerCase().includes('fetch') ||
                          error.message.toLowerCase().includes('xhr');

    return {
      hasError: true,
      error,
      errorInfo: null,
      isNetworkError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Uncaught error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // In production, we could send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
      isNetworkError: this.isNetworkError(error)
    });
  }

  private isNetworkError(error: Error): boolean {
    return error.message.toLowerCase().includes('network') || 
           error.message.toLowerCase().includes('fetch') ||
           error.message.toLowerCase().includes('xhr');
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error reporting service integration
    // This could be integrated with services like Sentry, LogRocket, etc.
    try {
      // Example error reporting structure
      const errorReport = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // For now, we'll just log to console in production
      console.error('Error Report:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleRetry = () => {
    // Clear the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isNetworkError: false
    });

    // Attempt to re-render the component
    if (this.state.isNetworkError) {
      // For network errors, we might want to retry the failed request
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              {this.state.isNetworkError ? 'Network Error' : 'Something went wrong'}
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {this.state.isNetworkError && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Please check your internet connection and try again.
                </p>
              )}
            </div>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {this.state.isNetworkError ? 'Retry Connection' : 'Reload Page'}
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Go to Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-6">
                <details className="cursor-pointer">
                  <summary className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
