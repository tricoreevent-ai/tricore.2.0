import { Link } from 'react-router-dom';

import {
  contactContent,
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

const getInitials = (value) =>
  String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

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

export default function HomePageContentSections({ content, events, eventsError, eventsLoading }) {
  const featuredEvents = Array.isArray(events) ? events : [];
  const primaryWhatsAppPhone =
    contactContent.whatsAppPhone ||
    contactContent.partners.flatMap((partner) => partner.phones || [])[0] ||
    '';
  const quickWhatsAppHref = getWhatsAppHref(primaryWhatsAppPhone, contactContent.whatsAppMessage);
  const eventsTitle = content?.eventsTitle || 'Upcoming Tournaments';
  const eventsDescription =
    content?.eventsDescription || homePageContentFallback.eventsDescription;
  const visibleTestimonials = Array.isArray(content?.testimonials)
    ? content.testimonials.filter((testimonial) => testimonial?.quote && testimonial?.name)
    : [];
  const introBadge = content?.introBadge || homePageContentFallback.introBadge;
  const introTitle = content?.introTitle || homePageContentFallback.introTitle;
  const introDescription = content?.introDescription || homePageContentFallback.introDescription;
  const introActionLabel = content?.introActionLabel || homePageContentFallback.introActionLabel;
  const introActionHref = content?.introActionHref || homePageContentFallback.introActionHref;
  return (
    <>
      <section className="container-shell mt-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="public-panel p-8 sm:p-10">
            <p className="public-label">{introBadge}</p>
            <h2 className="public-title-section mt-5 max-w-4xl">{introTitle}</h2>
            <div className="public-accent-line mt-6" />
            <p className="public-copy mt-6">{introDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="public-btn-primary" to={introActionHref}>
                {introActionLabel}
              </Link>
              <Link className="public-btn-secondary" to="/contact">
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="public-panel-soft p-8 sm:p-10">
            <div className="grid gap-4">
              {whyChooseItems.map((item) => (
                <div className="public-panel-ghost p-5" key={item.title}>
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-[#d4af37]">
                      <AppIcon className="h-5 w-5" name={item.icon} />
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">{item.title}</h3>
                      <p className="public-copy-small mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="public-label">Upcoming Tournaments</p>
            <h2 className="public-title-section mt-4">{eventsTitle}</h2>
            <p className="public-copy mt-4 max-w-3xl">{eventsDescription}</p>
          </div>
          <Link className="public-btn-secondary" to="/events">
            View all events
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
            className={`grid gap-6 ${
              featuredEvents.length === 1
                ? 'mx-auto max-w-3xl'
                : featuredEvents.length === 2
                  ? 'xl:grid-cols-2'
                  : 'xl:grid-cols-3'
            } md:grid-cols-2`}
          >
            {featuredEvents.map((event) => {
              const registrationStatus = getPublicEventRegistrationStatus(event);
              const isComingSoon = registrationStatus === 'coming_soon';

              return (
                <article className="public-panel h-full overflow-hidden" key={event._id}>
                  <div className="border-b border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="public-chip">{event.sportType}</span>
                        <h3 className="public-title-card mt-4">{event.name}</h3>
                      </div>
                      <StatusBadge event={event} />
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-6">
                    <div className="grid gap-4 border-b border-white/8 pb-5 sm:grid-cols-2">
                      <div className="public-stat-block">
                        <p className="public-meta">Start</p>
                        <p className="mt-3 text-xl font-extrabold text-white">{formatDate(event.startDate)}</p>
                      </div>
                      <div className="public-stat-block">
                        <p className="public-meta">Entry Fee</p>
                        <p className="mt-3 text-xl font-extrabold text-white">{formatCurrency(event.entryFee)}</p>
                      </div>
                    </div>
                    {event.description ? (
                      <p className="public-copy-small mt-5">{event.description}</p>
                    ) : null}
                    <div className="mt-5 grid gap-3 text-sm text-[#a0a0a0]">
                      <p>
                        <span className="font-semibold text-white">Venue:</span> {event.venue}
                      </p>
                      <p>
                        <span className="font-semibold text-white">
                          {isComingSoon ? 'Registration Opens:' : 'Registration Deadline:'}
                        </span>{' '}
                        {isComingSoon && event.registrationStartDate
                          ? formatDateTime(event.registrationStartDate)
                          : event.registrationDeadline
                            ? formatDate(event.registrationDeadline)
                            : 'Coming Soon'}
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link className="public-btn-primary w-full" to={`/events/${event._id}`}>
                        {isComingSoon ? 'Notify later' : 'View event'}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
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

      {content?.galleryEnabledHome ? (
        <ImageGallerySection
          description={content.homeGalleryDescription}
          images={content.homeGalleryImages}
          title={content.homeGalleryTitle}
        />
      ) : null}

      {content?.testimonialsEnabledHome && visibleTestimonials.length ? (
        <section className="container-shell mt-14">
          <div className="mb-10 max-w-4xl">
            <p className="public-label">Testimonials</p>
            <h2 className="public-title-section mt-4">
              {content.testimonialsTitle || 'What Our Clients Say'}
            </h2>
            {content.testimonialsDescription ? (
              <p className="public-copy mt-4">{content.testimonialsDescription}</p>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {visibleTestimonials.map((testimonial) => (
              <article className="public-panel h-full p-7" key={testimonial.id || testimonial.name}>
                <p className="text-5xl font-extrabold leading-none text-[#d4af37]">"</p>
                <p className="public-copy mt-5">{testimonial.quote}</p>
                <div className="mt-6 flex items-center gap-4">
                  {testimonial.avatarUrl ? (
                    <img
                      alt={testimonial.avatarAlt || testimonial.name}
                      className="h-14 w-14 object-cover"
                      src={testimonial.avatarUrl}
                    />
                  ) : (
                    <div className="inline-flex h-14 w-14 items-center justify-center border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] text-lg font-extrabold text-[#d4af37]">
                      {getInitials(testimonial.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-extrabold text-white">{testimonial.name}</p>
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
        title="Partner Highlights"
      />

      <section className="container-shell mt-14">
        <div className="public-panel-soft overflow-hidden p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="public-label">{homeFinalCta.badge}</p>
              <h2 className="public-title-section mt-5 max-w-3xl">{homeFinalCta.title}</h2>
              <p className="public-copy mt-5 max-w-3xl">{homeFinalCta.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
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
        </div>
      </section>
    </>
  );
}
