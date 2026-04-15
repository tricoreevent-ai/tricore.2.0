const getInitials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

export default function PartnerHighlights({ description, partners, title = 'Partner Highlights' }) {
  if (!partners?.length) {
    return null;
  }

  return (
    <section className="container-shell mt-14">
      <div className="public-panel p-8 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="public-title-section">{title}</h2>
          </div>
          {description ? <p className="public-copy max-w-2xl">{description}</p> : null}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {partners.map((partner) => (
            <article className="public-panel-soft p-6" key={partner.name}>
              {partner.logoUrl ? (
                <div className="flex min-h-24 items-center justify-center border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4">
                  <img
                    alt={partner.logoAlt || `${partner.name} logo`}
                    className="h-14 w-auto max-w-full object-contain sm:h-16"
                    loading="lazy"
                    src={partner.logoUrl}
                  />
                </div>
              ) : (
                <div className="inline-flex h-14 w-14 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-lg font-extrabold text-[#d4af37]">
                  {getInitials(partner.name)}
                </div>
              )}
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  {partner.role}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-white">{partner.name}</h3>
                <p className="public-copy-small mt-4">{partner.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
