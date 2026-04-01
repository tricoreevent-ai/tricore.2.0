const TRICORE_LOGO_SRC = '/tricore-logo.png';

export function TriCoreMark({ className = 'h-12 w-12' }) {
  return (
    <img
      alt="TriCore Events logo"
      className={`${className} shrink-0 object-contain`}
      src={TRICORE_LOGO_SRC}
    />
  );
}

export default function TriCoreLogo({
  className = '',
  markClassName = 'h-12 w-12',
  showText = true,
  titleClassName = 'font-display text-xl font-bold tracking-tight text-slate-950 sm:text-2xl',
  subtitleClassName = 'text-xs text-slate-500 sm:text-sm',
  subtitle = 'Event Management & Experiences'
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TriCoreMark className={markClassName} />
      {showText ? (
        <div>
          <p className={titleClassName}>TriCore Events</p>
          <p className={subtitleClassName}>{subtitle}</p>
        </div>
      ) : null}
    </div>
  );
}
