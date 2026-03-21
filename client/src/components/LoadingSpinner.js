const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-indigo-200 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-300/40 border-t-indigo-300" />
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
