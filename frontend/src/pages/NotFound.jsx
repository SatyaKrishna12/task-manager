import { Link } from 'react-router-dom';

/**
 * NotFound Page Component (404)
 * Displayed when user navigates to a non-existent route
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        
        {/* Error Message */}
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>

        {/* Decorative SVG */}
        <div className="mt-12">
          <svg
            className="mx-auto h-64 w-64 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
