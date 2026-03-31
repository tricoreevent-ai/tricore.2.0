import AppIcon from './AppIcon.jsx';

const toneClasses = {
  blue: 'text-[#d4af37]',
  orange: 'text-[#d4af37]',
  emerald: 'text-emerald-300',
  slate: 'text-white',
  rose: 'text-red-300'
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon = 'overview',
  tone = 'blue',
  helper = '',
  valueClassName = ''
}) {
  return (
    <div className="panel p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p
          className={`text-4xl font-extrabold tracking-[-1px] ${toneClasses[tone] || toneClasses.blue} ${valueClassName}`.trim()}
        >
          {value}
        </p>
        <AppIcon className="h-6 w-6 text-[rgba(212,175,55,0.25)]" name={icon} />
      </div>
      {helper ? (
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
          {helper}
        </p>
      ) : null}
      {subtitle ? (
        <p className={`text-sm leading-6 text-[#a0a0a0] ${helper ? 'mt-2' : 'mt-4'}`.trim()}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
