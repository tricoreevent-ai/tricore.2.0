export const BANGALORE_LOCATION_LABEL = 'Bangalore, Karnataka, India';

const cleanKeyword = (value) => String(value || '').trim();

export const mergeSeoKeywords = (...groups) =>
  Array.from(
    new Set(
      groups
        .flat()
        .map(cleanKeyword)
        .filter(Boolean)
    )
  );

export const BANGALORE_CORE_KEYWORDS = [
  'Bangalore event management',
  'Bengaluru event management',
  'Bangalore event planners',
  'Bangalore event company',
  'Bangalore corporate events',
  'Bangalore sports events',
  'Bangalore tournament management',
  'Bangalore cricket events',
  'Bangalore corporate cricket tournament',
  'event management company in Bangalore',
  'sports event management company in Bangalore',
  'corporate event management company in Bangalore',
  'Bengaluru corporate event planners',
  'Karnataka event management',
  'TriCore Events Bangalore'
];

export const HOME_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'corporate events in Bangalore',
  'corporate experiences in Bangalore',
  'sports tournaments in Bangalore',
  'corporate sports tournaments in Bangalore',
  'corporate cricket events in Bangalore',
  'cricket tournament management Bangalore',
  'sports event management Bangalore',
  'event registrations Bangalore',
  'tournament schedules Bangalore',
  'sports payments Bangalore',
  'corporate event quote Bangalore',
  'TriCore Events'
]);

export const ABOUT_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'about TriCore Events',
  'Bangalore event company about',
  'Bangalore sports event organizers',
  'Bangalore corporate event partner',
  'event management team Bangalore'
]);

export const EVENTS_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'upcoming events in Bangalore',
  'upcoming sports events in Bangalore',
  'cricket tournaments in Bangalore',
  'football tournaments in Bangalore',
  'badminton tournaments in Bangalore',
  'community events in Bangalore',
  'event registrations in Bangalore',
  'Bangalore tournament registration'
]);

export const CORPORATE_EVENTS_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'corporate event management Bangalore',
  'corporate events Bangalore',
  'team building Bangalore',
  'strategic offsites Bangalore',
  'employee engagement events Bangalore',
  'product launches Bangalore',
  'brand activations Bangalore',
  'conference planning Bangalore',
  'offsite planners Bangalore',
  'TriCore Events'
]);

export const CONTACT_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'contact TriCore Events',
  'Bangalore event planner contact',
  'Bangalore corporate event enquiry',
  'Bangalore sports tournament contact',
  'event quote Bangalore'
]);

export const SPONSORSHIP_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'sports sponsorship Bangalore',
  'event sponsorship Bangalore',
  'cricket tournament sponsorship Bangalore',
  'brand activation sponsorship Bangalore',
  'Bangalore sports sponsor opportunities'
]);

export const EVENT_DETAIL_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'event details Bangalore',
  'tournament details Bangalore',
  'sports event schedule Bangalore',
  'cricket event details Bangalore',
  'register for Bangalore events'
]);

export const EVENT_PAYMENT_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'event payment Bangalore',
  'event registration payment Bangalore',
  'sports registration payment Bangalore'
]);

export const FALLBACK_PAGE_SEO_KEYWORDS = mergeSeoKeywords(BANGALORE_CORE_KEYWORDS, [
  'TriCore Events',
  'Bangalore event services'
]);

export const buildEventSeoKeywords = (event) =>
  mergeSeoKeywords(EVENT_DETAIL_PAGE_SEO_KEYWORDS, [
    event?.name,
    event?.sportType ? `${event.sportType} event Bangalore` : '',
    event?.sportType ? `${event.sportType} tournament Bangalore` : '',
    event?.venue ? `${event.venue} Bangalore` : ''
  ]);
