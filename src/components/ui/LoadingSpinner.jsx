export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-900/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full"></div>
        </div>
      </div>
      {message && (
        <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}
