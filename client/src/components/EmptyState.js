const EmptyState = ({ title = 'No data found', subtitle = 'Try changing the filters and try again.' }) => {
  return (
    <div className="rounded-2xl border border-dashed border-white/30 bg-white/10 p-8 text-center shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/50">
      <p className="inline-block animate-pulse text-lg font-semibold text-indigo-300">{title}</p>
      <p className="mt-1 text-sm text-slate-200">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
