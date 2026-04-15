import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { getMatchesByEvent } from '../../api/dashboardApi.js';
import { getEventById } from '../../api/eventsApi.js';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import PageVectorArt from '../../components/common/PageVectorArt.jsx';
import SeoMetadata from '../../components/common/SeoMetadata.jsx';
import NotifyInterestPanel from '../../components/events/NotifyInterestPanel.jsx';
import RegistrationForm from '../../components/dashboards/RegistrationForm.jsx';
import { contactContent } from '../../data/siteContent.js';
import useAuth from '../../hooks/useAuth.js';
import { buildEventSeoKeywords } from '../../seo/publicSeo.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters.js';
import {
  getPublicEventRegistrationStatus,
  isRegistrationComingSoonForEvent,
  isRegistrationOpenForEvent
} from '../../utils/eventTimeline.js';

const registrationStatusClasses = {
  open: 'border-emerald-500/25 bg-emerald-500/12 text-emerald-100',
  coming_soon: 'border-amber-500/25 bg-amber-500/12 text-amber-100',
  completed: 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]',
  closed: 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]'
};

const registrationStatusLabels = {
  open: 'Registration Open',
  coming_soon: 'Coming Soon',
  completed: 'Event Completed',
  closed: 'Registration Closed'
};

const normalizeBaseUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

const infoCards = (event) => [
  {
    label: 'Venue',
    value: event.venue
  },
  {
    label: 'Entry Fee',
    value: formatCurrency(event.entryFee)
  },
  {
    label: 'Dates',
    value: `${formatDate(event.startDate)} to ${formatDate(event.endDate)}`
  },
  {
    label: 'Registration Deadline',
    value: event.registrationDeadline ? formatDate(event.registrationDeadline) : 'Coming Soon'
  },
  {
    label: 'Registration Opens',
    value: event.registrationStartDate
      ? formatDateTime(event.registrationStartDate)
      : event.registrationDeadline
        ? 'Already open'
        : 'Coming Soon'
  },
  {
    label: 'Team Size',
    value: event.teamSize
  },
  {
    label: 'Player Limit',
    value: event.playerLimit
  }
];

export default function EventDetailPage() {
  const { eventId } = useParams();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [event, setEvent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewEvent = location.state?.eventPreview || null;
  const lockedStatus = previewEvent ? getPublicEventRegistrationStatus(previewEvent) : 'closed';
  const baseUrl = normalizeBaseUrl(
    contactContent.website ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.tricoreevents.online')
  );
  const canonicalUrl = `${baseUrl}/events/${eventId}`;

  useEffect(() => {
    let ignore = false;

    const loadDetail = async () => {
      if (authLoading) {
        return;
      }

      if (!isAuthenticated) {
        setLoading(false);
        setError('');
        setMatches([]);
        setEvent(previewEvent);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [eventResponse, matchesResponse] = await Promise.all([
          getEventById(eventId),
          getMatchesByEvent(eventId)
        ]);

        if (ignore) {
          return;
        }

        setEvent(eventResponse);
        setMatches(matchesResponse);
      } catch (requestError) {
        if (!ignore) {
          setError(getApiErrorMessage(requestError, 'Unable to load event details right now.'));
          setEvent(null);
          setMatches([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      ignore = true;
    };
  }, [authLoading, eventId, isAuthenticated, previewEvent]);

  const registrationStatus = useMemo(() => {
    if (!event) {
      return lockedStatus;
    }

    return getPublicEventRegistrationStatus(event);
  }, [event, lockedStatus]);
  const seoEvent = event || previewEvent;
  const seoTitle = seoEvent?.name
    ? `${seoEvent.name} | Bangalore Event | TriCore Events`
    : 'Event Details in Bangalore | TriCore Events';
  const seoDescription = seoEvent?.name
    ? `View ${seoEvent.name} registration details, dates, venue, and participation guidance for this Bangalore ${seoEvent.sportType || 'sports'} event.`
    : 'View TriCore Bangalore event details, registration deadlines, venue information, payment instructions, and participation guidance.';
  const seoKeywords = useMemo(() => buildEventSeoKeywords(seoEvent), [seoEvent]);
  const seoMetadata = (
    <SeoMetadata
      canonicalUrl={canonicalUrl}
      description={seoDescription}
      keywords={seoKeywords}
      title={seoTitle}
      url={canonicalUrl}
    />
  );

  if (authLoading || loading) {
    return (
      <>
        {seoMetadata}
        <LoadingSpinner label={authLoading ? 'Checking your sign-in...' : 'Loading event details...'} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {seoMetadata}
        <div className="container-shell py-8 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="public-panel overflow-hidden">
              <div className="border-b border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-5 text-white sm:p-8">
                <span className="public-chip-neutral">
                  {previewEvent?.sportType || 'Event access'}
                </span>
                <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  {previewEvent?.name || 'Sign in to view this event'}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d9d9d9] sm:text-base">
                  Google login is required before a user can open event details, see the full schedule,
                  or start registration.
                </p>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
                <div className="public-panel-ghost p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                    Access
                  </p>
                  <p className="mt-2 text-base font-bold text-white">Google sign-in required</p>
                </div>
                <div className="public-panel-ghost p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                    Status
                  </p>
                  <p className="mt-2 text-base font-bold text-white">
                    {registrationStatusLabels[lockedStatus] || registrationStatusLabels.closed}
                  </p>
                </div>
              </div>
            </section>

            <aside className="public-panel-soft p-5 sm:p-6">
              <PageVectorArt compact className="mb-5" variant="sports" />
              <span className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${registrationStatusClasses[lockedStatus] || registrationStatusClasses.closed}`}>
                {registrationStatusLabels[lockedStatus] || registrationStatusLabels.closed}
              </span>
              <h2 className="mt-4 text-xl font-bold text-white">Unlock event details</h2>
              <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">
                Sign in with Google to see the full event page, review the schedule, confirm your
                account email, and register from the same screen.
              </p>

              <div className="mt-5 rounded-[1.75rem] border border-dashed border-[rgba(212,175,55,0.2)] bg-[rgba(255,255,255,0.03)] p-4 sm:p-5">
                <p className="mb-3 text-sm font-medium text-[#d9d9d9]">
                  Continue with your Google account to access this event.
                </p>
                <GoogleLoginButton />
              </div>

              <div className="mt-5 space-y-3">
                <div className="public-panel-ghost p-4">
                  <p className="text-sm font-semibold text-white">Why sign in first?</p>
                  <p className="mt-2 text-sm leading-6 text-[#a0a0a0]">
                    It keeps registrations tied to one account, shows your email during form filling,
                    and lets you return later to add more players to the same registration.
                  </p>
                </div>
                <div className="public-panel-ghost p-4">
                  <p className="text-sm font-semibold text-white">Best on mobile too</p>
                  <p className="mt-2 text-sm leading-6 text-[#a0a0a0]">
                    Once you sign in, the detail page switches to a tighter mobile layout with stacked
                    cards, touch-friendly actions, and a fixed account bar at the top.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {seoMetadata}
        <div className="container-shell py-8 sm:py-10">
          <div className="public-panel p-6 text-center sm:p-8">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Unable to load event</h1>
            <p className="mt-3 text-sm text-red-300">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        {seoMetadata}
        <div className="container-shell py-8 sm:py-10">
          <div className="public-panel p-6 text-center sm:p-8">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Event not found</h1>
          </div>
        </div>
      </>
    );
  }

  const isRegistrationOpen = isRegistrationOpenForEvent(event);
  const isComingSoon = isRegistrationComingSoonForEvent(event);

  return (
    <>
      {seoMetadata}
      <div className="container-shell py-5 sm:py-8 lg:py-10">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] xl:gap-8">
          <section className="space-y-5">
            <div className="public-panel overflow-hidden">
              <div className="border-b border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-5 text-white sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <span className="public-chip-neutral">{event.sportType}</span>
                    <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{event.name}</h1>
                    {event.description ? (
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d9d9d9] sm:text-base">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <span className={`inline-flex w-fit items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${registrationStatusClasses[registrationStatus] || registrationStatusClasses.closed}`}>
                    {registrationStatusLabels[registrationStatus] || registrationStatusLabels.closed}
                  </span>
                  <PageVectorArt compact className="w-full shrink-0 lg:max-w-xs" variant="sports" />
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                {infoCards(event).map((item) => (
                  <div className="public-panel-ghost p-4" key={item.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-bold leading-6 text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="public-panel p-4 sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">Match Schedule</h2>
                <p className="mt-2 text-sm text-[#a0a0a0]">
                  Participants can review the published fixtures for this event.
                </p>
              </div>

              {matches.length ? (
                <>
                  <div className="space-y-3 md:hidden">
                    {matches.map((match) => (
                      <article className="public-panel-ghost p-4" key={match._id}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                              {match.roundLabel || 'Knockout'}
                            </p>
                            <p className="mt-2 text-base font-bold text-white">
                              {match.teamA} vs {match.teamB}
                            </p>
                          </div>
                          <span className="public-chip-neutral">
                            {match.time || 'TBD'}
                          </span>
                        </div>
                        <div className="mt-4 grid gap-3 text-sm text-[#a0a0a0] sm:grid-cols-2">
                          <p>
                            <span className="font-semibold text-white">Date:</span> {match.date || 'TBD'}
                          </p>
                          <p>
                            <span className="font-semibold text-white">Venue:</span> {match.venue || 'TBD'}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-[#a0a0a0]">
                          <th className="pb-3 pr-4">Round</th>
                          <th className="pb-3 pr-4">Match</th>
                          <th className="pb-3 pr-4">Date</th>
                          <th className="pb-3 pr-4">Time</th>
                          <th className="pb-3">Venue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.map((match) => (
                          <tr className="border-b border-white/8" key={match._id}>
                            <td className="py-4 pr-4 text-[#a0a0a0]">{match.roundLabel || 'Knockout'}</td>
                            <td className="py-4 pr-4 font-medium text-white">
                              {match.teamA} vs {match.teamB}
                            </td>
                            <td className="py-4 pr-4 text-[#a0a0a0]">{match.date || 'TBD'}</td>
                            <td className="py-4 pr-4 text-[#a0a0a0]">{match.time || 'TBD'}</td>
                            <td className="py-4 text-[#a0a0a0]">{match.venue || 'TBD'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-6 text-sm text-[#a0a0a0]">
                  Schedule has not been published yet.
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="public-panel-soft p-4 sm:p-6">
              <span className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${registrationStatusClasses[registrationStatus] || registrationStatusClasses.closed}`}>
                {registrationStatusLabels[registrationStatus] || registrationStatusLabels.closed}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white">Participation</h2>
              <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">
                {isRegistrationOpen
                  ? 'Registrations are open. Sign in, confirm your Google account details, and submit or update the roster from this page.'
                  : isComingSoon
                    ? 'Registrations have not opened yet. Join the notify-later list so you are contacted as soon as the event goes live.'
                    : registrationStatus === 'completed'
                      ? 'This event has already been completed and no longer accepts new registrations.'
                      : 'Registrations are currently unavailable for this event.'}
              </p>
            </div>

            {isRegistrationOpen ? (
              <RegistrationForm event={event} />
            ) : isComingSoon ? (
              <div className="public-panel p-4 sm:p-6">
                <NotifyInterestPanel event={event} />
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
