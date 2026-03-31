import { Link } from 'react-router-dom';

import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters.js';
import { getPublicEventRegistrationStatus, isPastEvent } from '../../utils/eventTimeline.js';

export default function EventCard({ event }) {
  const isPast = isPastEvent(event);
  const registrationStatus = getPublicEventRegistrationStatus(event);
  const statusClass =
    registrationStatus === 'completed'
      ? 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#a0a0a0]'
      : registrationStatus === 'open'
        ? 'border-emerald-500/25 bg-emerald-500/12 text-emerald-100'
        : registrationStatus === 'coming_soon'
          ? 'border-amber-500/25 bg-amber-500/12 text-amber-100'
          : 'border-white/10 bg-[rgba(255,255,255,0.06)] text-white';
  const statusLabel =
    registrationStatus === 'completed'
      ? 'Completed'
      : registrationStatus === 'open'
        ? 'Registration Open'
        : registrationStatus === 'coming_soon'
          ? 'Coming Soon'
      : 'Registration Closed';

  return (
    <article className="public-panel overflow-hidden">
      <div className="border-b border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-5 text-white sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="public-chip">{event.sportType}</span>
            <h3 className="mt-4 text-2xl font-extrabold text-white">{event.name}</h3>
            <p className="mt-2 max-w-xl text-sm text-[#a0a0a0]">
              {event.description || 'Tournament-ready event operations with structured registrations and scheduling.'}
            </p>
          </div>
          <span className={`inline-flex w-fit items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 text-sm text-[#a0a0a0] sm:grid-cols-2">
          <p>
            <span className="font-semibold text-white">Venue:</span> {event.venue}
          </p>
          <p>
            <span className="font-semibold text-white">Entry Fee:</span> {formatCurrency(event.entryFee)}
          </p>
          <p>
            <span className="font-semibold text-white">Dates:</span> {formatDate(event.startDate)} to {formatDate(event.endDate)}
          </p>
          <p>
            <span className="font-semibold text-white">Registrations:</span> {event.registrationCount || 0}/{event.maxParticipants}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#666666]">
            {isPast
              ? `Completed: ${formatDate(event.endDate)}`
              : registrationStatus === 'coming_soon'
                ? `Registration opens: ${event.registrationStartDate ? formatDateTime(event.registrationStartDate) : 'Coming Soon'}`
                : event.registrationDeadline
                  ? `Deadline: ${formatDate(event.registrationDeadline)}`
                  : 'Registration window will be announced shortly.'}
          </p>
          <Link
            className="public-btn-primary w-full sm:w-auto"
            state={{ eventPreview: event }}
            to={`/events/${event._id}`}
          >
            {registrationStatus === 'coming_soon' ? 'Notify Later' : 'View Event'}
          </Link>
        </div>
      </div>
    </article>
  );
}
