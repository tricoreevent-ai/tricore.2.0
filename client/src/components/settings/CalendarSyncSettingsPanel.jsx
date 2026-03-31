import { useEffect, useMemo, useState } from 'react';

import AppIcon from '../common/AppIcon.jsx';
import FormAlert from '../common/FormAlert.jsx';
import { formatDateTime } from '../../utils/formatters.js';

const defaultForm = {
  lookAheadDays: 90,
  showPublicHolidays: true,
  showRegionalFestivals: true,
  showReligiousFestivals: true,
  showSportsObservances: true,
  showCivicObservances: true,
  showStrikeAdvisories: true,
  autoSync: false,
  syncInterval: 'weekly',
  syncTime: '02:00',
  feeds: []
};

const syncStatusLabel = {
  idle: 'Not Run Yet',
  success: 'Success',
  partial: 'Partial',
  failed: 'Failed'
};

const syncStatusTone = {
  idle: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  partial: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600'
};

const formatShortDate = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const toFormState = (config) => ({
  ...defaultForm,
  ...config,
  feeds: Array.isArray(config?.feeds)
    ? config.feeds.map((feed) => ({
        key: feed.key,
        enabled: Boolean(feed.enabled)
      }))
    : []
});

export default function CalendarSyncSettingsPanel({
  config,
  error,
  message,
  onRefresh,
  onRunSync,
  onSave,
  runPending,
  savePending
}) {
  const [form, setForm] = useState(() => toFormState(config));
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setForm(toFormState(config));
    setLocalError('');
  }, [config]);

  const enabledFeedCount = useMemo(
    () => form.feeds.filter((feed) => feed.enabled).length,
    [form.feeds]
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
    setLocalError('');
  };

  const toggleFeed = (feedKey) => {
    setForm((current) => ({
      ...current,
      feeds: current.feeds.map((feed) =>
        feed.key === feedKey
          ? { ...feed, enabled: !feed.enabled }
          : feed
      )
    }));
    setLocalError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (Number(form.lookAheadDays) < 90) {
      setLocalError('The sync range must cover at least the next 90 days.');
      return;
    }

    await onSave({
      lookAheadDays: Number(form.lookAheadDays),
      showPublicHolidays: Boolean(form.showPublicHolidays),
      showRegionalFestivals: Boolean(form.showRegionalFestivals),
      showReligiousFestivals: Boolean(form.showReligiousFestivals),
      showSportsObservances: Boolean(form.showSportsObservances),
      showCivicObservances: Boolean(form.showCivicObservances),
      showStrikeAdvisories: Boolean(form.showStrikeAdvisories),
      autoSync: Boolean(form.autoSync),
      syncInterval: form.syncInterval,
      syncTime: form.syncTime,
      feeds: form.feeds.map((feed) => ({
        key: feed.key,
        enabled: Boolean(feed.enabled)
      }))
    });
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">Sync Window</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{form.lookAheadDays} Days</p>
          <p className="mt-2 text-sm text-slate-500">
            The manual sync refreshes holidays and major sports fixtures for at least the next three months.
          </p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">Enabled Feeds</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{enabledFeedCount}</p>
          <p className="mt-2 text-sm text-slate-500">
            IPL and World Cup feeds can be toggled individually without touching TriCore event data.
          </p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">Last Sync</p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {config?.lastSyncAt ? formatDateTime(config.lastSyncAt) : 'No sync run yet'}
          </p>
          <p className="mt-2 text-sm text-slate-500">{config?.lastSyncSummary || 'Run a sync to load the latest local calendar bundle.'}</p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">Status</p>
          <div className="mt-3">
            <span className={`badge ${syncStatusTone[config?.lastSyncStatus] || syncStatusTone.idle}`}>
              {syncStatusLabel[config?.lastSyncStatus] || syncStatusLabel.idle}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Manual sync updates holidays, regional celebrations, religious festivals, and enabled sports fixtures.
          </p>
        </div>
      </div>

      <form className="panel space-y-8 p-6" onSubmit={handleSave}>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Calendar & Sync</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Keep the admin calendar updated with the next 90+ days of TriCore planning context, Indian holidays, regional celebrations, religious festivals, and major sports schedules.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button className="btn-secondary" onClick={onRefresh} type="button">
              Refresh
            </button>
            <button className="btn-secondary gap-2" disabled={runPending} onClick={onRunSync} type="button">
              <AppIcon className="h-4 w-4" name="refresh" />
              {runPending ? 'Syncing...' : 'Sync Now'}
            </button>
            <button className="btn-primary" disabled={savePending} type="submit">
              {savePending ? 'Saving...' : 'Save Sync Settings'}
            </button>
          </div>
        </div>

        <FormAlert message={error || localError} />
        <FormAlert message={message} type="success" />

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="label" htmlFor="calendar-lookAheadDays">
              Sync Window (days)
            </label>
            <input
              className="input"
              id="calendar-lookAheadDays"
              min="90"
              onChange={(event) => updateField('lookAheadDays', event.target.value)}
              type="number"
              value={form.lookAheadDays}
            />
            <p className="mt-2 text-xs text-slate-500">Minimum 90 days, so the planner always has a three-month view.</p>
          </div>
          <div>
            <label className="label" htmlFor="calendar-syncInterval">
              Auto-Sync Interval
            </label>
            <select
              className="input"
              id="calendar-syncInterval"
              onChange={(event) => updateField('syncInterval', event.target.value)}
              value={form.syncInterval}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="calendar-syncTime">
              Auto-Sync Time
            </label>
            <input
              className="input"
              id="calendar-syncTime"
              onChange={(event) => updateField('syncTime', event.target.value)}
              type="time"
              value={form.syncTime}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input
            checked={form.autoSync}
            onChange={(event) => updateField('autoSync', event.target.checked)}
            type="checkbox"
          />
          Enable saved auto-sync preferences for scheduled runs
        </label>

        <div>
          <h3 className="text-lg font-bold text-slate-950">Holiday Coverage</h3>
          <p className="mt-2 text-sm text-slate-500">
            Choose which national and cultural calendars should appear in the shared admin calendar by default.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['showPublicHolidays', 'Indian public holidays'],
              ['showRegionalFestivals', 'Regional celebrations'],
              ['showReligiousFestivals', 'Religious festivals of India'],
              ['showSportsObservances', 'Sports / wellness observances'],
              ['showCivicObservances', 'Civic / political observances'],
              ['showStrikeAdvisories', 'Strike / advisory alerts']
            ].map(([key, label]) => (
              <label className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700" key={key}>
                <span className="flex items-center gap-3">
                  <input
                    checked={Boolean(form[key])}
                    onChange={(event) => updateField(key, event.target.checked)}
                    type="checkbox"
                  />
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-950">Bundled Sports Feeds</h3>
          <p className="mt-2 text-sm text-slate-500">
            These feed bundles power the manual sync. IPL entries include teams and venue details, and the FIFA World Cup feed includes published schedule slots for the upcoming window.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {(config?.feeds || []).map((feed) => {
              const formFeed = form.feeds.find((item) => item.key === feed.key);
              const isEnabled = formFeed ? formFeed.enabled : Boolean(feed.enabled);

              return (
                <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5" key={feed.key}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-bold text-slate-950">{feed.name}</h4>
                        <span className={`badge ${isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{feed.coverageSummary}</p>
                    </div>
                    <label className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      <input
                        checked={isEnabled}
                        onChange={() => toggleFeed(feed.key)}
                        type="checkbox"
                      />
                      Include in sync
                    </label>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sport</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{feed.sportType}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Source Type</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{feed.sourceType}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Bundled Items</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{feed.itemCount}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Window</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatShortDate(feed.windowStart)} to {formatShortDate(feed.windowEnd)}
                      </p>
                    </div>
                  </div>

                  {feed.sourceUrl ? (
                    <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange" href={feed.sourceUrl} rel="noreferrer" target="_blank">
                      View source reference
                      <AppIcon className="h-4 w-4" name="export" />
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </form>

      <section className="panel p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-bold">Recent Sync History</h3>
            <p className="mt-2 text-sm text-slate-500">
              Manual sync may take some time because it refreshes every enabled holiday and sports feed in one run.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {config?.syncLog?.length ? (
            config.syncLog.map((entry) => (
              <article className="rounded-2xl bg-slate-50 px-4 py-4" key={`${entry.runAt}-${entry.status}-${entry.summary}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{entry.runAt ? formatDateTime(entry.runAt) : 'Unknown run time'}</p>
                    <p className="mt-1 text-sm text-slate-500">{entry.summary || 'No summary saved for this run.'}</p>
                  </div>
                  <span className={`badge ${syncStatusTone[entry.status] || syncStatusTone.idle}`}>
                    {syncStatusLabel[entry.status] || syncStatusLabel.idle}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
              No sync history yet. Use Sync Now to populate the next 90 days of calendar context.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

