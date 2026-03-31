import { z } from 'zod';

import { objectIdSchema, optionalTextSchema } from './common.js';

const calendarSportTypes = ['Cricket', 'Football', 'Badminton', 'Swimming', 'Multi-Sport', 'Other'];
const calendarSportSourceTypes = ['manual', 'announcement', 'official_schedule', 'api', 'ical', 'other'];
const calendarSyncIntervals = ['daily', 'weekly', 'monthly'];

const dateRangeQuery = z
  .object({
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional()
  })
  .refine(
    (query) => !query.dateFrom || !query.dateTo || new Date(query.dateFrom) <= new Date(query.dateTo),
    {
      message: 'From date must be before or equal to To date.',
      path: ['dateFrom']
    }
  );

const sportsCalendarEventFields = z.object({
  name: z.string().trim().min(3, 'Event name is required.'),
  description: optionalTextSchema,
  sportType: z.enum(calendarSportTypes),
  startDate: z.string().datetime().or(z.string().date()),
  endDate: z.string().datetime().or(z.string().date()),
  location: optionalTextSchema,
  competitionName: optionalTextSchema,
  stageLabel: optionalTextSchema,
  homeTeam: optionalTextSchema,
  awayTeam: optionalTextSchema,
  sourceName: optionalTextSchema,
  sourceUrl: optionalTextSchema,
  sourceType: z.enum(calendarSportSourceTypes).optional()
});

const sportsCalendarEventBody = sportsCalendarEventFields.refine(
  (body) => new Date(body.startDate) <= new Date(body.endDate),
  {
    message: 'Start date must be on or before end date.',
    path: ['startDate']
  }
);

const partialSportsCalendarEventBody = sportsCalendarEventFields.partial().refine(
  (body) => {
    if (!body.startDate || !body.endDate) {
      return true;
    }

    return new Date(body.startDate) <= new Date(body.endDate);
  },
  {
    message: 'Start date must be on or before end date.',
    path: ['startDate']
  }
);

const calendarFeedToggleSchema = z.object({
  key: z.string().trim().min(1, 'Feed key is required.'),
  enabled: z.boolean()
});

const calendarSyncSettingsBody = z.object({
  lookAheadDays: z.coerce.number().int().min(90).max(366).optional(),
  showPublicHolidays: z.boolean().optional(),
  showRegionalFestivals: z.boolean().optional(),
  showReligiousFestivals: z.boolean().optional(),
  showSportsObservances: z.boolean().optional(),
  showCivicObservances: z.boolean().optional(),
  showStrikeAdvisories: z.boolean().optional(),
  autoSync: z.boolean().optional(),
  syncInterval: z.enum(calendarSyncIntervals).optional(),
  syncTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  feeds: z.array(calendarFeedToggleSchema).optional()
});

export const calendarFeedQuerySchema = z.object({
  query: dateRangeQuery
});

export const createSportsCalendarEventSchema = z.object({
  body: sportsCalendarEventBody
});

export const updateSportsCalendarEventSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: partialSportsCalendarEventBody
});

export const sportsCalendarEventIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const updateCalendarSyncSettingsSchema = z.object({
  body: calendarSyncSettingsBody
});
