export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <div className="text-white text-xl font-medium animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};