const StatCard = ({ title, value, hint }) => {
  return (
    <div className="cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-indigo-500/50">
      <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-200">{hint}</p>
    </div>
  );
};

export default StatCard;
