export default function LoadingSpinner({ compact = false, label = 'Loading...' }) {
  const containerClassName = compact
    ? 'flex min-h-[120px] items-center justify-center bg-transparent'
    : 'flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,rgba(10,10,10,0.94)_0%,rgba(17,17,17,0.92)_42%,rgba(10,10,10,0.94)_100%)] px-4 py-10';
  const panelClassName = compact
    ? 'relative overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.16)] bg-[linear-gradient(180deg,rgba(11,15,23,0.98)_0%,rgba(18,22,31,0.96)_100%)] px-6 py-5 shadow-[0_24px_64px_rgba(0,0,0,0.28)]'
    : 'relative overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.16)] bg-[linear-gradient(180deg,rgba(11,15,23,0.72)_0%,rgba(18,22,31,0.66)_100%)] px-6 py-5 shadow-[0_24px_64px_rgba(0,0,0,0.28)] backdrop-blur-md';

  return (
    <div className={containerClassName}>
      <div className={panelClassName}>
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d4af37,#34d399,#0f5fdb)] animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11">
            <span className="absolute inset-0 rounded-full border-2 border-white/10" />
            <span className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#d4af37] border-r-emerald-400 animate-spin" />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37] animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Loading
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
