import { AppSetting } from '../models/AppSetting.js';
import { calendarSyncFeedCatalog } from '../data/calendarSyncSources.js';

export const CALENDAR_SYNC_SETTINGS_KEY = 'calendar-sync-settings';

const DEFAULT_SYNC_INTERVAL = 'weekly';
const DEFAULT_SYNC_TIME = '02:00';
const DEFAULT_LOOK_AHEAD_DAYS = 90;
const MAX_SYNC_LOG_ITEMS = 12;
const ALLOWED_SYNC_INTERVALS = new Set(['daily', 'weekly', 'monthly']);
const ALLOWED_SYNC_STATUSES = new Set(['idle', 'success', 'partial', 'failed']);

const buildDefaultFeedOverrides = () =>
  Object.fromEntries(
    calendarSyncFeedCatalog.map((feed) => [feed.feedKey, { enabled: Boolean(feed.enabledByDefault) }])
  );

const DEFAULT_CALENDAR_SYNC_SETTINGS = {
  lookAheadDays: DEFAULT_LOOK_AHEAD_DAYS,
  showPublicHolidays: true,
  showRegionalFestivals: true,
  showReligiousFestivals: true,
  showSportsObservances: true,
  showCivicObservances: true,
  showStrikeAdvisories: true,
  autoSync: false,
  syncInterval: DEFAULT_SYNC_INTERVAL,
  syncTime: DEFAULT_SYNC_TIME,
  feedOverrides: buildDefaultFeedOverrides(),
  lastSyncAt: null,
  lastSyncStatus: 'idle',
  lastSyncSummary: 'Calendar sync has not been run yet.',
  lastSyncDetails: null,
  syncLog: []
};

const populateUpdatedBy = (query) => query.populate('updatedBy', 'name username email');
const normalizeBoolean = (value, fallback = false) =>
  typeof value === 'boolean' ? value : fallback;
const normalizePositiveInteger = (value, fallback = DEFAULT_LOOK_AHEAD_DAYS) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed >= DEFAULT_LOOK_AHEAD_DAYS ? parsed : fallback;
};
const normalizeText = (value) => String(value || '').trim();
const normalizeSyncInterval = (value) => {
  const normalized = normalizeText(value).toLowerCase();
  return ALLOWED_SYNC_INTERVALS.has(normalized) ? normalized : DEFAULT_SYNC_INTERVAL;
};
const normalizeSyncTime = (value) => {
  const normalized = normalizeText(value);
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(normalized)
    ? normalized
    : DEFAULT_SYNC_TIME;
};
const normalizeSyncStatus = (value) => {
  const normalized = normalizeText(value).toLowerCase();
  return ALLOWED_SYNC_STATUSES.has(normalized) ? normalized : 'idle';
};
const normalizeSyncLogItem = (item = {}) => ({
  runAt: normalizeText(item.runAt) || null,
  status: normalizeSyncStatus(item.status),
  summary: normalizeText(item.summary).slice(0, 400),
  details: item.details && typeof item.details === 'object' ? item.details : null
});

const normalizeFeedOverrides = (value) => {
  const defaults = buildDefaultFeedOverrides();

  if (Array.isArray(value)) {
    return value.reduce((accumulator, feed) => {
      const key = normalizeText(feed?.key);

      if (!defaults[key]) {
        return accumulator;
      }

      return {
        ...accumulator,
        [key]: {
          enabled: normalizeBoolean(feed?.enabled, defaults[key].enabled)
        }
      };
    }, defaults);
  }

  if (!value || typeof value !== 'object') {
    return defaults;
  }

  return Object.keys(defaults).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: {
        enabled: normalizeBoolean(value[key]?.enabled, defaults[key].enabled)
      }
    }),
    defaults
  );
};

const normalizeCalendarSyncSettingsValue = (value = {}) => ({
  lookAheadDays: normalizePositiveInteger(value.lookAheadDays, DEFAULT_LOOK_AHEAD_DAYS),
  showPublicHolidays: normalizeBoolean(value.showPublicHolidays, true),
  showRegionalFestivals: normalizeBoolean(value.showRegionalFestivals, true),
  showReligiousFestivals: normalizeBoolean(value.showReligiousFestivals, true),
  showSportsObservances: normalizeBoolean(value.showSportsObservances, true),
  showCivicObservances: normalizeBoolean(value.showCivicObservances, true),
  showStrikeAdvisories: normalizeBoolean(value.showStrikeAdvisories, true),
  autoSync: normalizeBoolean(value.autoSync, false),
  syncInterval: normalizeSyncInterval(value.syncInterval),
  syncTime: normalizeSyncTime(value.syncTime),
  feedOverrides: normalizeFeedOverrides(value.feedOverrides || value.feeds),
  lastSyncAt: normalizeText(value.lastSyncAt) || null,
  lastSyncStatus: normalizeSyncStatus(value.lastSyncStatus),
  lastSyncSummary:
    normalizeText(value.lastSyncSummary).slice(0, 400) || DEFAULT_CALENDAR_SYNC_SETTINGS.lastSyncSummary,
  lastSyncDetails: value.lastSyncDetails && typeof value.lastSyncDetails === 'object'
    ? value.lastSyncDetails
    : null,
  syncLog: Array.isArray(value.syncLog)
    ? value.syncLog.map(normalizeSyncLogItem).filter((item) => item.runAt || item.summary).slice(0, MAX_SYNC_LOG_ITEMS)
    : []
});

const serializeCalendarSyncSettings = (settingDocument) => {
  const normalized = normalizeCalendarSyncSettingsValue(
    settingDocument?.value || DEFAULT_CALENDAR_SYNC_SETTINGS
  );

  return {
    lookAheadDays: normalized.lookAheadDays,
    showPublicHolidays: normalized.showPublicHolidays,
    showRegionalFestivals: normalized.showRegionalFestivals,
    showReligiousFestivals: normalized.showReligiousFestivals,
    showSportsObservances: normalized.showSportsObservances,
    showCivicObservances: normalized.showCivicObservances,
    showStrikeAdvisories: normalized.showStrikeAdvisories,
    autoSync: normalized.autoSync,
    syncInterval: normalized.syncInterval,
    syncTime: normalized.syncTime,
    feeds: calendarSyncFeedCatalog.map((feed) => ({
      key: feed.feedKey,
      name: feed.name,
      sportType: feed.sportType,
      sourceType: feed.sourceType,
      sourceUrl: feed.sourceUrl,
      coverageSummary: feed.coverageSummary,
      itemCount: feed.itemCount,
      windowStart: feed.windowStart,
      windowEnd: feed.windowEnd,
      enabled: normalized.feedOverrides[feed.feedKey]?.enabled ?? Boolean(feed.enabledByDefault)
    })),
    lastSyncAt: normalized.lastSyncAt,
    lastSyncStatus: normalized.lastSyncStatus,
    lastSyncSummary: normalized.lastSyncSummary,
    lastSyncDetails: normalized.lastSyncDetails,
    syncLog: normalized.syncLog,
    updatedAt: settingDocument?.updatedAt || null,
    updatedBy: settingDocument?.updatedBy || null
  };
};

export const ensureCalendarSyncSettingDocument = async () => {
  const existing = await AppSetting.findOne({ key: CALENDAR_SYNC_SETTINGS_KEY });

  if (!existing) {
    return populateUpdatedBy(
      AppSetting.findOneAndUpdate(
        { key: CALENDAR_SYNC_SETTINGS_KEY },
        {
          key: CALENDAR_SYNC_SETTINGS_KEY,
          value: DEFAULT_CALENDAR_SYNC_SETTINGS
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true
        }
      )
    );
  }

  const normalized = normalizeCalendarSyncSettingsValue(existing.value || {});

  if (JSON.stringify(normalized) === JSON.stringify(existing.value || {})) {
    return populateUpdatedBy(AppSetting.findOne({ key: CALENDAR_SYNC_SETTINGS_KEY }));
  }

  return populateUpdatedBy(
    AppSetting.findOneAndUpdate(
      { key: CALENDAR_SYNC_SETTINGS_KEY },
      {
        $set: {
          value: normalized
        }
      },
      {
        new: true,
        runValidators: true
      }
    )
  );
};

export const getCalendarSyncSettingsDocument = async () => ensureCalendarSyncSettingDocument();

export const getCalendarSyncSettings = async () =>
  serializeCalendarSyncSettings(await getCalendarSyncSettingsDocument());

export const updateCalendarSyncSettings = async ({ payload, userId }) => {
  const existing = await getCalendarSyncSettingsDocument();
  const existingValue = normalizeCalendarSyncSettingsValue(existing?.value || DEFAULT_CALENDAR_SYNC_SETTINGS);
  const nextValue = normalizeCalendarSyncSettingsValue({
    ...existingValue,
    ...payload,
    feedOverrides: payload?.feeds ?? payload?.feedOverrides ?? existingValue.feedOverrides,
    lastSyncAt: existingValue.lastSyncAt,
    lastSyncStatus: existingValue.lastSyncStatus,
    lastSyncSummary: existingValue.lastSyncSummary,
    lastSyncDetails: existingValue.lastSyncDetails,
    syncLog: existingValue.syncLog
  });

  const updated = await populateUpdatedBy(
    AppSetting.findOneAndUpdate(
      { key: CALENDAR_SYNC_SETTINGS_KEY },
      {
        key: CALENDAR_SYNC_SETTINGS_KEY,
        value: nextValue,
        updatedBy: userId
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    )
  );

  return serializeCalendarSyncSettings(updated);
};

export const recordCalendarSyncResult = async ({ status, summary, details, userId }) => {
  const existing = await getCalendarSyncSettingsDocument();
  const existingValue = normalizeCalendarSyncSettingsValue(existing?.value || DEFAULT_CALENDAR_SYNC_SETTINGS);
  const runAt = new Date().toISOString();
  const nextLogItem = normalizeSyncLogItem({
    runAt,
    status,
    summary,
    details
  });
  const updated = await populateUpdatedBy(
    AppSetting.findOneAndUpdate(
      { key: CALENDAR_SYNC_SETTINGS_KEY },
      {
        key: CALENDAR_SYNC_SETTINGS_KEY,
        value: {
          ...existingValue,
          lastSyncAt: runAt,
          lastSyncStatus: nextLogItem.status,
          lastSyncSummary: nextLogItem.summary,
          lastSyncDetails: nextLogItem.details,
          syncLog: [nextLogItem, ...existingValue.syncLog].slice(0, MAX_SYNC_LOG_ITEMS)
        },
        updatedBy: userId || existing?.updatedBy || null
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    )
  );

  return serializeCalendarSyncSettings(updated);
};
