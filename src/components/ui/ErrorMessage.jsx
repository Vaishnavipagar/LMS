export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-red-300">Error</h3>
          <p className="text-sm text-red-400/80">{message}</p>
        </div>
      </div>
      
      {onRetry && (
        <div className="flex space-x-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  );
}