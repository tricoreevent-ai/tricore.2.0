import { Link } from 'react-router-dom';

import {
  contactContent,
  eventsContent,
  homeFinalCta,
  homePageContentFallback,
  partnerHighlights,
  whyChooseItems
} from '../../data/siteContent.js';
import { getWhatsAppHref } from '../../utils/contactLinks.js';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters.js';
import { getPublicEventRegistrationStatus } from '../../utils/eventTimeline.js';
import AppIcon from '../common/AppIcon.jsx';
import ImageGallerySection from '../common/ImageGallerySection.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import PartnerHighlights from '../common/PartnerHighlights.jsx';

const mainPoints = [
  {
    icon: 'trophy',
    label: 'Tournament Ready',
    title: 'Sports events with match-day control',
    description: 'Fixtures, registrations, officials, scoring flow, and finals stay organized from one plan.',
    href: '/events'
  },
  {
    icon: 'users',
    label: 'Team Energy',
    title: 'Corporate sports and engagement',
    description: 'Cricket leagues, team-building formats, offsites, and workplace experiences built around participation.',
    href: '/corporate-events'
  },
  {
    icon: 'settings',
    label: 'Execution Team',
    title: 'Partner-led operations',
    description: 'Experienced venue, vendor, and event partners handle the moving parts with calm coordination.',
    href: '/about'
  }
];

const getInitials = (value) =>
  String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const getShortText = (value, fallback) => {
  const normalized = String(value || fallback || '').trim();

  if (!normalized) {
    return '';
  }

  const sentenceEnd = normalized.indexOf('. ');
  return sentenceEnd === -1 ? normalized : normalized.slice(0, sentenceEnd + 1);
};

const StatusBadge = ({ event }) => {
  const status = getPublicEventRegistrationStatus(event);
  const tone =
    status === 'open'
      ? 'border-emerald-500/25 bg-emerald-500/12 text-emerald-200'
      : status === 'coming_soon'
        ? 'border-amber-500/25 bg-amber-500/12 text-amber-100'
        : 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]';

  return (
    <span className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${tone}`}>
      {status === 'open' ? 'Open' : status === 'coming_soon' ? 'Coming Soon' : 'Closed'}
    </span>
  );
};

const EventCard = ({ event }) => {
  const registrationStatus = getPublicEventRegistrationStatus(event);
  const isComingSoon = registrationStatus === 'coming_soon';

  return (
    <article className="public-panel h-full overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="border-b border-[rgba(212,175,55,0.14)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="public-chip">{event.sportType}</span>
              <h3 className="public-title-card mt-4">{event.name}</h3>
            </div>
            <StatusBadge event={event} />
          </div>
        </div>

        <div className="grid gap-px bg-[rgba(255,255,255,0.08)] sm:grid-cols-3">
          <div className="bg-[#141414] p-4">
            <p className="public-meta">Start</p>
            <p className="mt-2 text-base font-extrabold text-white">{formatDate(event.startDate)}</p>
          </div>
          <div className="bg-[#141414] p-4">
            <p className="public-meta">Fee</p>
            <p className="mt-2 text-base font-extrabold text-white">{formatCurrency(event.entryFee)}</p>
          </div>
          <div className="bg-[#141414] p-4">
            <p className="public-meta">Venue</p>
            <p className="mt-2 text-base font-extrabold text-white">{event.venue || 'Announcing soon'}</p>
          </div>
        </div>

        <div className="mt-auto p-5">
          <p className="text-sm leading-6 text-[#a0a0a0]">
            {isComingSoon && event.registrationStartDate
              ? `Registration opens ${formatDateTime(event.registrationStartDate)}.`
              : event.registrationDeadline
                ? `Register before ${formatDate(event.registrationDeadline)}.`
                : 'Registration timeline will be announced soon.'}
          </p>
          <Link className="public-btn-primary mt-5 w-full" to={`/events/${event._id}`}>
            {isComingSoon ? 'Notify Me' : 'View Event'}
          </Link>
        </div>
      </div>
    </article>
  );
};

const DetailAccordion = ({ items, title }) => (
  <details className="group border border-[rgba(255,255,255,0.1)] bg-[#141414] open:border-[rgba(212,175,55,0.28)]">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
      <span className="text-base font-extrabold text-white">{title}</span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[rgba(212,175,55,0.2)] text-[#d4af37] transition group-open:rotate-45">
        +
      </span>
    </summary>
    <div className="border-t border-[rgba(255,255,255,0.08)] px-5 py-5">
      <ul className="public-dot-list space-y-3 text-sm leading-7 text-[#a0a0a0]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </details>
);

export default function HomePageContentSections({ content, events, eventsError, eventsLoading }) {
  const featuredEvents = Array.isArray(events) ? events : [];
  const primaryWhatsAppPhone =
    contactContent.whatsAppPhone ||
    contactContent.partners.flatMap((partner) => partner.phones || [])[0] ||
    '';
  const quickWhatsAppHref = getWhatsAppHref(primaryWhatsAppPhone, contactContent.whatsAppMessage);
  const eventsTitle = content?.eventsTitle || 'Upcoming Tournaments';
  const eventsDescription = getShortText(
    content?.eventsDescription,
    homePageContentFallback.eventsDescription
  );
  const visibleTestimonials = Array.isArray(content?.testimonials)
    ? content.testimonials.filter((testimonial) => testimonial?.quote && testimonial?.name)
    : [];
  const introBadge = content?.introBadge || homePageContentFallback.introBadge;
  const introTitle = content?.introTitle || homePageContentFallback.introTitle;
  const introDescription = getShortText(
    content?.introDescription,
    homePageContentFallback.introDescription
  );
  const introActionLabel = content?.introActionLabel || homePageContentFallback.introActionLabel;
  const introActionHref = content?.introActionHref || homePageContentFallback.introActionHref;
  const detailSections = [
    {
      title: 'Sports Tournament Scope',
      items: eventsContent.sports
    },
    {
      title: 'Corporate Event Scope',
      items: eventsContent.corporate
    },
    {
      title: 'Execution Process',
      items: eventsContent.process.map((step) => `${step.title}: ${step.description}`)
    },
    {
      title: 'Why Teams Choose TriCore',
      items: whyChooseItems.map((item) => `${item.title}: ${item.description}`)
    }
  ];

  return (
    <>
      <section className="container-shell mt-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="public-label">{introBadge}</p>
            <h2 className="public-title-section mt-4">{introTitle}</h2>
            <p className="public-copy mt-4">{introDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="public-btn-primary" to={introActionHref}>
              {introActionLabel}
            </Link>
            <Link className="public-btn-secondary" to="/contact">
              Request Quote
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-px bg-[rgba(212,175,55,0.16)] lg:grid-cols-3">
          {mainPoints.map((point, index) => (
            <Link className="group bg-[#141414] p-6 transition hover:bg-[#181818]" key={point.title} to={point.href}>
              <div className="flex items-center justify-between gap-4">
                <span className="public-meta">0{index + 1} / {point.label}</span>
                <span className="inline-flex h-11 w-11 items-center justify-center border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.08)] text-[#d4af37] transition group-hover:bg-[rgba(212,175,55,0.14)]">
                  <AppIcon className="h-5 w-5" name={point.icon} />
                </span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold leading-tight text-white">{point.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">{point.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="public-label">Upcoming Events</p>
            <h2 className="public-title-section mt-4">{eventsTitle}</h2>
            <p className="public-copy mt-4 max-w-3xl">{eventsDescription}</p>
          </div>
          <Link className="public-btn-secondary" to="/events">
            View All Events
          </Link>
        </div>

        {eventsLoading ? (
          <div className="public-panel p-8">
            <LoadingSpinner compact label="Loading upcoming events..." />
          </div>
        ) : eventsError ? (
          <div className="public-panel p-8">
            <p className="text-sm text-red-300">{eventsError}</p>
          </div>
        ) : featuredEvents.length ? (
          <div
            className={`grid gap-5 ${
              featuredEvents.length === 1
                ? 'mx-auto max-w-3xl'
                : featuredEvents.length === 2
                  ? 'xl:grid-cols-2'
                  : 'xl:grid-cols-3'
            } md:grid-cols-2`}
          >
            {featuredEvents.map((event) => (
              <EventCard event={event} key={event._id} />
            ))}
          </div>
        ) : (
          <div className="public-panel p-8">
            <p className="public-copy-small">
              No upcoming events are published yet. New tournaments will appear here once the admin
              team publishes them.
            </p>
          </div>
        )}
      </section>

      <section className="public-page-alt mt-12 py-12">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
            <div>
              <p className="public-label">Operational Playbook</p>
              <h2 className="public-title-section mt-4">Deeper scope for serious event planning.</h2>
              <p className="public-copy mt-4">
                Review formats, responsibilities, and delivery flow before choosing the right event plan.
              </p>
            </div>
            <div className="space-y-3">
              {detailSections.map((section) => (
                <DetailAccordion items={section.items} key={section.title} title={section.title} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {content?.galleryEnabledHome ? (
        <ImageGallerySection
          description={content.homeGalleryDescription}
          images={content.homeGalleryImages}
          title={content.homeGalleryTitle}
        />
      ) : null}

      {content?.testimonialsEnabledHome && visibleTestimonials.length ? (
        <section className="container-shell mt-12">
          <div className="mb-8 max-w-4xl">
            <p className="public-label">Testimonials</p>
            <h2 className="public-title-section mt-4">
              {content.testimonialsTitle || 'What Our Clients Say'}
            </h2>
            {content.testimonialsDescription ? (
              <p className="public-copy mt-4">{content.testimonialsDescription}</p>
            ) : null}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {visibleTestimonials.map((testimonial) => (
              <article className="public-panel h-full p-6" key={testimonial.id || testimonial.name}>
                <p className="text-4xl font-extrabold leading-none text-[#d4af37]">"</p>
                <p className="public-copy mt-4">{testimonial.quote}</p>
                <div className="mt-5 flex items-center gap-4">
                  {testimonial.avatarUrl ? (
                    <img
                      alt={testimonial.avatarAlt || testimonial.name}
                      className="h-12 w-12 object-cover"
                      src={testimonial.avatarUrl}
                    />
                  ) : (
                    <div className="inline-flex h-12 w-12 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-base font-extrabold text-[#d4af37]">
                      {getInitials(testimonial.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-extrabold text-white">{testimonial.name}</p>
                    {testimonial.role ? (
                      <p className="text-sm text-[#a0a0a0]">{testimonial.role}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <PartnerHighlights
        partners={partnerHighlights}
        title="Execution Partners"
      />

      <section className="container-shell mt-12">
        <div className="grid gap-6 border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="public-label">{homeFinalCta.badge}</p>
            <h2 className="public-title-section mt-4 max-w-3xl">{homeFinalCta.title}</h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link className="public-btn-primary" to={homeFinalCta.primaryActionHref}>
              {homeFinalCta.primaryActionLabel}
            </Link>
            {quickWhatsAppHref ? (
              <a className="public-btn-whatsapp" href={quickWhatsAppHref} rel="noreferrer" target="_blank">
                {homeFinalCta.secondaryActionLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
