import { Link } from 'react-router-dom';

import AppIcon from '../../components/common/AppIcon.jsx';
import SeoMetadata from '../../components/common/SeoMetadata.jsx';
import { contactContent, corporateEventsContent } from '../../data/siteContent.js';
import { getTelephoneHref, getWhatsAppHref } from '../../utils/contactLinks.js';

const DEFAULT_SEO_TITLE = 'Corporate Events & Experiences | TriCore Events';
const DEFAULT_SEO_DESCRIPTION =
  'TriCore Events plans meetings, conferences, team-building programs, strategic offsites, AGMs, employee engagement events, and product launches with partner-led execution.';
const DEFAULT_SEO_KEYWORDS = [
  'corporate event management',
  'corporate conferences',
  'team building programs',
  'strategic offsites',
  'employee engagement events',
  'product launches',
  'brand activations',
  'TriCore Events'
];

const normalizeBaseUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

const buildStructuredData = ({ baseUrl, phone }) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Corporate Events & Experiences',
    description: DEFAULT_SEO_DESCRIPTION,
    areaServed: 'IN',
    url: `${baseUrl}/corporate-events`,
    provider: {
      '@type': 'Organization',
      name: 'TriCore Events',
      url: `${baseUrl}/`,
      email: contactContent.email,
      telephone: phone || undefined
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Corporate Events',
        item: `${baseUrl}/corporate-events`
      }
    ]
  }
];

export default function CorporateEventsPage() {
  const baseUrl = normalizeBaseUrl(
    contactContent.website ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.tricoreevents.online')
  );
  const canonicalUrl = `${baseUrl}/corporate-events`;
  const primaryPhone = contactContent.partners.flatMap((partner) => partner.phones || [])[0] || '';
  const quickContactHref = primaryPhone ? getTelephoneHref(primaryPhone) : '/contact';
  const whatsAppHref = getWhatsAppHref(
    contactContent.whatsAppPhone || primaryPhone,
    contactContent.whatsAppMessage
  );

  return (
    <div className="pb-28">
      <SeoMetadata
        canonicalUrl={canonicalUrl}
        description={DEFAULT_SEO_DESCRIPTION}
        keywords={DEFAULT_SEO_KEYWORDS}
        structuredData={buildStructuredData({ baseUrl, phone: primaryPhone })}
        title={DEFAULT_SEO_TITLE}
        url={canonicalUrl}
      />

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="public-label">
              {corporateEventsContent.heroBadge}
            </p>
            <h1 className="public-title-page mt-5 max-w-4xl">
              {corporateEventsContent.heroTitle}
            </h1>
            <div className="public-accent-line mt-6" />
            <p className="public-copy mt-6 max-w-3xl text-lg">
              {corporateEventsContent.heroDescription}
            </p>
            <p className="public-copy mt-5 max-w-3xl">
              {corporateEventsContent.heroSupportingCopy}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="public-btn-primary" to={corporateEventsContent.primaryActionHref}>
                {corporateEventsContent.primaryActionLabel}
              </Link>
              {whatsAppHref ? (
                <a className="public-btn-whatsapp" href={whatsAppHref} rel="noreferrer" target="_blank">
                  <AppIcon className="h-4 w-4" name="whatsapp" />
                  Talk on WhatsApp
                </a>
              ) : quickContactHref.startsWith('tel:') ? (
                <a className="public-btn-secondary" href={quickContactHref}>
                  Call TriCore
                </a>
              ) : (
                <Link className="public-btn-secondary" to={corporateEventsContent.secondaryActionHref}>
                  {corporateEventsContent.secondaryActionLabel}
                </Link>
              )}
            </div>
          </div>

          <div className="public-panel-soft overflow-hidden text-white">
            <div className="p-8 sm:p-10">
              <p className="public-label">
                What we handle
              </p>
              <h2 className="public-title-section mt-5">
                Corporate formats designed around clarity, polish, and measurable impact
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {corporateEventsContent.focusAreas.map((item) => (
                  <div
                    className="public-panel-ghost p-5"
                    key={item}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white">
                        <AppIcon className="h-4 w-4" name="check" />
                      </span>
                      <p className="public-copy-small">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="public-panel p-8 sm:p-10">
            <p className="public-label">
              {corporateEventsContent.introTitle}
            </p>
            <h2 className="public-title-section mt-5">
              Strategic event planning with practical execution discipline
            </h2>
            <p className="public-copy mt-5">
              {corporateEventsContent.introDescription}
            </p>
            <p className="public-copy mt-5">
              {corporateEventsContent.introSupportingCopy}
            </p>
          </div>

          <div className="public-panel-soft p-8">
            <p className="public-label">
              Why corporate teams call us
            </p>
            <div className="mt-6 space-y-4">
              {[
                'Your event reflects your brand, so we protect the details that shape perception.',
                'Your internal team stays focused on people, messaging, and decisions while we manage execution.',
                'Your attendees experience a professional flow built around comfort, clarity, and confidence.'
              ].map((item) => (
                <div className="public-panel-ghost p-5" key={item}>
                  <p className="public-copy-small">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-24">
        <div className="max-w-4xl">
          <p className="public-label">
            {corporateEventsContent.servicesTitle}
          </p>
          <h2 className="public-title-section mt-4">
            A full corporate event suite built around your objectives
          </h2>
          <p className="public-copy mt-5">
            {corporateEventsContent.servicesDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {corporateEventsContent.services.map((service) => (
            <article className="public-panel h-full p-7" key={service.title}>
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-[#d4af37]">
                <AppIcon className="h-5 w-5" name={service.icon} />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold text-white">{service.title}</h3>
              <p className="public-copy mt-4">{service.description}</p>
              <div className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <div className="public-panel-ghost p-4" key={point}>
                    <p className="public-copy-small">{point}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="public-panel p-8 sm:p-10">
            <p className="public-label">
              {corporateEventsContent.credibilityTitle}
            </p>
            <h2 className="public-title-section mt-5">
              Real-world event experience, built for high-expectation environments
            </h2>
            <p className="public-copy mt-5">
              {corporateEventsContent.credibilityDescription}
            </p>
            <p className="public-copy mt-5">
              {corporateEventsContent.credibilitySupportingCopy}
            </p>
          </div>

          <div className="public-panel-soft p-8 sm:p-10">
            <p className="public-label">
              {corporateEventsContent.whyChooseTitle}
            </p>
            <div className="mt-6 grid gap-4">
              {corporateEventsContent.whyChooseItems.map((item) => (
                <div className="public-panel-ghost p-5" key={item}>
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-[#d4af37]">
                      <AppIcon className="h-4 w-4" name="check" />
                    </span>
                    <p className="public-copy-small">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-24">
        <div className="public-panel-soft overflow-hidden text-white">
          <div className="p-8 sm:p-10">
            <div className="max-w-4xl">
              <p className="public-label">
                {corporateEventsContent.processTitle}
              </p>
              <h2 className="public-title-section mt-5">
                A collaborative process designed to feel clear and stress-free
              </h2>
              <p className="public-copy mt-5">
                {corporateEventsContent.processDescription}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {corporateEventsContent.process.map((step, index) => (
                <div
                  className="public-panel-ghost p-5"
                  key={step.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      Step {index + 1}
                    </p>
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white">
                      <AppIcon className="h-4 w-4" name={step.icon} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-white">{step.title}</h3>
                  <p className="public-copy-small mt-3">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-24">
        <div className="public-panel p-8 sm:p-10">
          <p className="public-label">
            Let's talk
          </p>
          <h2 className="public-title-section mt-5">
            {corporateEventsContent.ctaTitle}
          </h2>
          <p className="public-copy mt-5 max-w-3xl">
            {corporateEventsContent.ctaDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="public-btn-primary" to={corporateEventsContent.primaryActionHref}>
              {corporateEventsContent.primaryActionLabel}
            </Link>
            {whatsAppHref ? (
              <a className="public-btn-whatsapp" href={whatsAppHref} rel="noreferrer" target="_blank">
                <AppIcon className="h-4 w-4" name="whatsapp" />
                Talk on WhatsApp
              </a>
            ) : quickContactHref.startsWith('tel:') ? (
              <a className="public-btn-secondary" href={quickContactHref}>
                Contact Us Today
              </a>
            ) : (
              <Link className="public-btn-secondary" to={corporateEventsContent.secondaryActionHref}>
                {corporateEventsContent.secondaryActionLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
