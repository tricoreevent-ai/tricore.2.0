export default function FloatingLabelField({
  error,
  helper,
  id,
  label,
  textarea = false,
  className = '',
  dark = false,
  inputRef = null,
  ...inputProps
}) {
  const inputClasses = [
    'peer block w-full rounded-2xl border px-4 pb-2.5 pt-5 text-sm',
    dark
      ? 'border-white/10 bg-[rgba(255,255,255,0.04)] text-white placeholder-transparent focus:border-[#d4af37] focus:ring-2 focus:ring-[rgba(212,175,55,0.16)] focus:outline-none'
      : 'border-slate-200 bg-transparent text-slate-900 placeholder-transparent focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none',
    textarea ? 'min-h-[112px] pt-6 resize-none' : '',
    error
      ? dark
        ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20'
        : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const labelClasses =
    `pointer-events-none absolute left-3 top-2 z-10 origin-[0] -translate-y-3.5 scale-90 px-2 text-xs font-medium transition-all duration-200 ${
      dark
        ? 'bg-[#141414] text-[#a0a0a0] peer-focus:text-[#d4af37]'
        : 'bg-white text-slate-500 peer-focus:text-brand-blue'
    } ` +
    'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 ' +
    'peer-focus:top-2 peer-focus:-translate-y-3.5 peer-focus:scale-90';

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          {...inputProps}
          aria-invalid={Boolean(error)}
          className={inputClasses}
          id={id}
          placeholder=" "
          ref={inputRef}
        />
      ) : (
        <input
          {...inputProps}
          aria-invalid={Boolean(error)}
          className={inputClasses}
          id={id}
          placeholder=" "
          ref={inputRef}
        />
      )}

      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>

      {error ? (
        <p className={`mt-2 text-xs font-medium ${dark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      ) : helper ? (
        <p className={`mt-2 text-xs ${dark ? 'text-[#a0a0a0]' : 'text-slate-500'}`}>{helper}</p>
      ) : null}
    </div>
  );
}
