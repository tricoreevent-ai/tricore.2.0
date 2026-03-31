import { CalendarSportsEvent } from '../models/CalendarSportsEvent.js';
import { getCalendarSyncSources } from '../data/calendarSyncSources.js';
import {
  getCalendarSyncSettings,
  recordCalendarSyncResult
} from './calendarSyncSettingsService.js';
import { refreshHolidayCache } from './calendarFeedService.js';

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const addDays = (value, days) => {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
};

const overlapsWindow = (item, windowStart, windowEnd) => {
  const itemStart = startOfDay(item.startDate);
  const itemEnd = endOfDay(item.endDate || item.startDate);
  return itemStart <= windowEnd && itemEnd >= windowStart;
};

const buildSyncWindow = (referenceDate, lookAheadDays) => {
  const windowStart = startOfDay(referenceDate);
  const windowEnd = endOfDay(addDays(windowStart, lookAheadDays));

  return {
    windowStart,
    windowEnd
  };
};

const buildSportsEventUpdate = ({ feed, item, userId }) => ({
  name: item.title,
  description: item.description || `${feed.name} fixture`,
  sportType: feed.sportType,
  startDate: new Date(item.startDate),
  endDate: new Date(item.endDate || item.startDate),
  location: item.location || '',
  competitionName: feed.name,
  stageLabel: item.stageLabel || '',
  feedKey: feed.feedKey,
  sourceId: item.sourceId,
  sourceName: feed.name,
  sourceType: feed.sourceType,
  sourceUrl: feed.sourceUrl,
  homeTeam: item.homeTeam || '',
  awayTeam: item.awayTeam || '',
  metadata: {
    ...(item.metadata || {}),
    coverageSummary: feed.coverageSummary
  },
  isAutoSynced: true,
  updatedBy: userId || null
});

const syncFeedSource = async ({ feed, enabled, windowStart, windowEnd, userId }) => {
  if (!enabled) {
    const removalResult = await CalendarSportsEvent.deleteMany({
      feedKey: feed.feedKey,
      isAutoSynced: true
    });

    return {
      feedKey: feed.feedKey,
      feedName: feed.name,
      enabled: false,
      status: 'disabled',
      scheduledCount: 0,
      removedCount: removalResult.deletedCount || 0,
      sourceItemCount: feed.items.length
    };
  }

  const scheduledItems = feed.items.filter((item) => overlapsWindow(item, windowStart, windowEnd));
  const sourceIds = scheduledItems.map((item) => item.sourceId);

  if (scheduledItems.length) {
    await CalendarSportsEvent.bulkWrite(
      scheduledItems.map((item) => ({
        updateOne: {
          filter: {
            feedKey: feed.feedKey,
            sourceId: item.sourceId
          },
          update: {
            $set: buildSportsEventUpdate({ feed, item, userId }),
            $setOnInsert: {
              createdBy: userId || null
            }
          },
          upsert: true
        }
      })),
      {
        ordered: false
      }
    );
  }

  const staleFilter = sourceIds.length
    ? { feedKey: feed.feedKey, isAutoSynced: true, sourceId: { $nin: sourceIds } }
    : { feedKey: feed.feedKey, isAutoSynced: true };
  const removalResult = await CalendarSportsEvent.deleteMany(staleFilter);

  return {
    feedKey: feed.feedKey,
    feedName: feed.name,
    enabled: true,
    status: 'success',
    scheduledCount: scheduledItems.length,
    removedCount: removalResult.deletedCount || 0,
    sourceItemCount: feed.items.length
  };
};

export const syncCalendarData = async ({ userId, referenceDate = new Date(), trigger = 'manual' } = {}) => {
  const settings = await getCalendarSyncSettings();
  const feeds = getCalendarSyncSources();
  const enabledFeedMap = Object.fromEntries(
    (settings.feeds || []).map((feed) => [feed.key, Boolean(feed.enabled)])
  );
  const { windowStart, windowEnd } = buildSyncWindow(referenceDate, settings.lookAheadDays);
  const holidaySummary = await refreshHolidayCache();
  const feedResults = [];
  const errors = [];

  for (const feed of feeds) {
    try {
      const result = await syncFeedSource({
        feed,
        enabled: enabledFeedMap[feed.feedKey] ?? Boolean(feed.enabledByDefault),
        windowStart,
        windowEnd,
        userId
      });
      feedResults.push(result);
    } catch (error) {
      feedResults.push({
        feedKey: feed.feedKey,
        feedName: feed.name,
        enabled: enabledFeedMap[feed.feedKey] ?? Boolean(feed.enabledByDefault),
        status: 'failed',
        scheduledCount: 0,
        removedCount: 0,
        sourceItemCount: feed.items.length,
        error: error.message
      });
      errors.push({
        feedKey: feed.feedKey,
        message: error.message
      });
    }
  }

  const totalScheduledCount = feedResults.reduce(
    (sum, item) => sum + (Number.isFinite(item.scheduledCount) ? item.scheduledCount : 0),
    0
  );
  const totalRemovedCount = feedResults.reduce(
    (sum, item) => sum + (Number.isFinite(item.removedCount) ? item.removedCount : 0),
    0
  );
  const status = errors.length ? (feedResults.some((item) => item.status === 'success') ? 'partial' : 'failed') : 'success';
  const summary =
    status === 'failed'
      ? 'Calendar sync failed before any feed could be updated.'
      : `Calendar sync ${status === 'partial' ? 'completed with some feed issues' : 'completed'}: ${totalScheduledCount} sports fixtures refreshed and ${holidaySummary.total} holiday entries reloaded for the next ${settings.lookAheadDays} days.`;
  const details = {
    trigger,
    referenceDate: referenceDate.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    holidaySummary,
    feeds: feedResults,
    totalScheduledCount,
    totalRemovedCount,
    errors
  };
  const savedSettings = await recordCalendarSyncResult({
    status,
    summary,
    details,
    userId
  });

  return {
    status,
    summary,
    details,
    settings: savedSettings
  };
};
