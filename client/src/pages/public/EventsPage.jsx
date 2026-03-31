import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEvents } from '../../api/eventsApi.js';
import CompactMonthCalendar from '../../components/calendar/CompactMonthCalendar.jsx';
import AppIcon from '../../components/common/AppIcon.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EventCard from '../../components/events/EventCard.jsx';
import { eventsContent } from '../../data/siteContent.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters.js';
import {
  getPublicEventRegistrationStatus,
  isPastEvent,
  isUpcomingOrOngoingEvent,
  isVisiblePublicEvent,
  sortEventsByStartDate,
  sortPublicUpcomingEvents
} from '../../utils/eventTimeline.js';

const sportTypes = ['All', 'Cricket', 'Football', 'Badminton', 'Swimming'];
const registrationStatusClasses = {
  open: 'border-emerald-500/25 bg-emerald-500/12 text-emerald-100',
  coming_soon: 'border-amber-500/25 bg-amber-500/12 text-amber-100',
  completed: 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]',
  closed: 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]'
};

const registrationDotClasses = {
  open: 'bg-emerald-400',
  coming_soon: 'bg-amber-400',
  completed: 'bg-slate-400',
  closed: 'bg-slate-400'
};

const registrationStatusLabels = {
  open: 'Registration Open',
  coming_soon: 'Coming Soon',
  completed: 'Completed',
  closed: 'Registration Closed'
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('All');
  const [error, setError] = useState('');
  const publicEvents = events.filter((event) => isVisiblePublicEvent(event));
  const upcomingEvents = sortPublicUpcomingEvents(
    publicEvents.filter((event) => isUpcomingOrOngoingEvent(event))
  );
  const pastEvents = sortEventsByStartDate(publicEvents)
    .filter((event) => isPastEvent(event))
    .reverse();
  const mobileCalendarEvents = useMemo(
    () => sortEventsByStartDate(publicEvents),
    [publicEvents]
  );
  const mobileCalendarInitialMonth = useMemo(
    () => mobileCalendarEvents[0]?.startDate || new Date(),
    [mobileCalendarEvents]
  );

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);

      try {
        const response = await getEvents(selectedSport === 'All' ? {} : { sportType: selectedSport });
        setEvents(response);
        setError('');
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Unable to load events right now.'));
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedSport]);

  return (
    <div className="container-shell py-10 sm:py-14 lg:py-16">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="public-label">Events</p>
          <h1 className="public-title-page mt-5">Fueling the spirit of competition</h1>
          <div className="public-accent-line mt-6" />
          <p className="public-copy mt-6 max-w-2xl">
            Whether you are a corporation building team spirit or a community creating connection,
            TriCore designs sports and corporate events that bring people closer through healthy
            competition, smooth operations, and memorable shared moments.
          </p>
        </div>
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
          {sportTypes.map((sport) => (
            <button
              className={`shrink-0 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                selectedSport === sport
                  ? 'border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.12)] text-[#d4af37]'
                  : 'border-white/10 bg-white/5 text-[#a0a0a0] hover:text-white'
              }`}
              key={sport}
              onClick={() => setSelectedSport(sport)}
              type="button"
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading events..." />
      ) : error ? (
        <div className="public-panel p-8">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : events.length ? (
        <div className="space-y-10">
          <section className="md:hidden">
            <CompactMonthCalendar
              emptyDayMessage="No event registrations are scheduled on this date for the current filter."
              getItemDotClass={(event) =>
                registrationDotClasses[getPublicEventRegistrationStatus(event)] || 'bg-brand-blue'
              }
              getItemId={(event) => event._id}
              initialMonth={mobileCalendarInitialMonth}
              items={mobileCalendarEvents}
              renderSelectedItem={(event) => {
                const registrationStatus = getPublicEventRegistrationStatus(event);

                return (
                  <article className="public-panel-soft p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-extrabold text-white">{event.name}</p>
                        <p className="mt-1 text-sm text-[#a0a0a0]">{event.sportType} registration</p>
                      </div>
                      <span
                        className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          registrationStatusClasses[registrationStatus] || registrationStatusClasses.closed
                        }`}
                      >
                        {registrationStatusLabels[registrationStatus] || registrationStatusLabels.closed}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-[#a0a0a0]">
                      <p>
                        <span className="font-semibold text-white">Dates:</span>{' '}
                        {formatDate(event.startDate)} to {formatDate(event.endDate)}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Entry Fee:</span>{' '}
                        {formatCurrency(event.entryFee)}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Registration Opens:</span>{' '}
                        {event.registrationStartDate
                          ? formatDateTime(event.registrationStartDate)
                          : event.registrationDeadline
                            ? 'Already open'
                            : 'Coming Soon'}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Registration Deadline:</span>{' '}
                        {event.registrationDeadline ? formatDate(event.registrationDeadline) : 'Coming Soon'}
                      </p>
                    </div>

                    <Link
                      className="public-btn-primary mt-4 w-full"
                      state={{ eventPreview: event }}
                      to={`/events/${event._id}`}
                    >
                      {registrationStatus === 'coming_soon' ? 'Open Notify View' : 'View Registration'}
                    </Link>
                  </article>
                );
              }}
              subtitle="Android-style month view for mobile. Tap a date to see only the registration details for that day."
              title="Event Calendar"
            />
          </section>

          <section className="hidden md:block">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="public-label">Upcoming Events</p>
                <h2 className="public-title-section mt-4">Open for discovery and registration</h2>
              </div>
              <p className="public-copy-small max-w-xl">
                Register for the next TriCore tournaments, leagues, and community events.
              </p>
            </div>

            {upcomingEvents.length ? (
              <div className="grid gap-6 xl:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <EventCard event={event} key={event._id} />
                ))}
              </div>
            ) : (
              <div className="public-panel p-8">
                <p className="public-copy-small">
                  No upcoming events match the selected sport right now. Check back soon for new
                  registrations.
                </p>
              </div>
            )}
          </section>

          <section className="hidden md:block">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="public-label">Past Events</p>
                <h2 className="public-title-section mt-4">Completed tournaments and earlier editions</h2>
              </div>
              <p className="public-copy-small max-w-xl">
                Look back at the events TriCore has already delivered across sports and corporate
                participation.
              </p>
            </div>

            {pastEvents.length ? (
              <div className="grid gap-6 xl:grid-cols-2">
                {pastEvents.map((event) => (
                  <EventCard event={event} key={event._id} />
                ))}
              </div>
            ) : (
              <div className="public-panel p-8">
                <p className="public-copy-small">
                  No past events are available for this filter yet.
                </p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="public-panel p-8">
          <p className="public-copy-small">
            No events are published yet. Once the admin team creates tournaments, they will appear here for registration.
          </p>
        </div>
      )}

      <div className="mb-10 mt-10 hidden gap-5 md:grid lg:grid-cols-2">
        <section className="public-panel p-5 sm:p-8">
          <p className="public-label">Sports Events</p>
          <h2 className="public-title-card mt-4">Sports Events</h2>
          <div className="mt-6 space-y-4">
            {eventsContent.sports.map((item) => (
              <div className="public-panel-ghost p-5" key={item}>
                <p className="public-copy-small">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="public-panel-soft p-5 sm:p-8">
          <p className="public-label">Corporate Events</p>
          <h2 className="public-title-card mt-4">Corporate Events</h2>
          <div className="mt-6 space-y-4">
            {eventsContent.corporate.map((item) => (
              <div className="public-panel-ghost p-5" key={item}>
                <p className="public-copy-small">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="hidden public-panel-soft p-5 md:block md:p-8">
        <div className="mb-8">
          <p className="public-label">Our Process</p>
          <h2 className="public-title-section mt-4">A blueprint for success</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          {eventsContent.process.map((step, index) => (
            <div
              className="public-panel-ghost p-5 transition hover:-translate-y-1"
              key={step.title}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  Step {index + 1}
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white">
                  <AppIcon className="h-5 w-5" name={step.icon} />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-white">{step.title}</h3>
              <p className="public-copy-small mt-3">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="public-copy mt-8">{eventsContent.difference}</p>
      </section>
    </div>
  );
}
