import { useEffect, useMemo, useState } from 'react';

import AppIcon from '../common/AppIcon.jsx';

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const normalizeMonth = (value) => {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const shiftMonth = (date, offset) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + offset);
  return nextDate;
};

const buildCalendarDays = (monthDate) => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
};

const getMonthToken = (value) =>
  new Date(value).toLocaleString('en-IN', {
    month: 'short'
  });

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

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

const dateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
  const [year, month, day] = String(value || '')
    .split('-')
    .map((part) => Number.parseInt(part, 10));

  if (!year || !month || !day) {
    return startOfDay(new Date());
  }

  return new Date(year, month - 1, day);
};

const itemOverlapsDay = (item, day) => {
  const start = startOfDay(item.startDate);
  const end = endOfDay(item.endDate || item.startDate);
  return start <= endOfDay(day) && end >= startOfDay(day);
};

const isSameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

const getFirstScheduledDateInMonth = (monthDate, items = []) => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const today = startOfDay(new Date());
  const scheduledDates = items
    .map((item) => {
      if (!item?.startDate) {
        return null;
      }

      const itemStart = startOfDay(item.startDate);
      const itemEnd = endOfDay(item.endDate || item.startDate);

      if (itemEnd < startOfDay(monthStart) || itemStart > endOfDay(monthEnd)) {
        return null;
      }

      return itemStart < monthStart ? monthStart : itemStart;
    })
    .filter(Boolean)
    .sort((left, right) => left.getTime() - right.getTime());

  return scheduledDates.find((date) => date >= today) || scheduledDates[0] || null;
};

const getDefaultSelectedDate = (monthDate, items = [], preferredDate) => {
  if (preferredDate && isSameMonth(preferredDate, monthDate)) {
    return startOfDay(preferredDate);
  }

  const scheduledDate = getFirstScheduledDateInMonth(monthDate, items);

  if (scheduledDate) {
    return scheduledDate;
  }

  const today = new Date();
  return isSameMonth(today, monthDate)
    ? startOfDay(today)
    : new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
};

export default function CompactMonthCalendar({
  className = '',
  emptyDayMessage = 'No items scheduled on this date.',
  getItemDotClass = () => 'bg-brand-blue',
  getItemId,
  initialSelectedDate,
  initialMonth,
  items = [],
  renderSelectedItem,
  showDayMonthTokens = true,
  showSelectionHeader = true,
  subtitle = '',
  title = 'Month View'
}) {
  const normalizedInitialMonth = normalizeMonth(initialMonth);
  const normalizedInitialSelectedDate = normalizeDate(initialSelectedDate);
  const [calendarMonth, setCalendarMonth] = useState(() => normalizedInitialMonth);
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    dateKey(getDefaultSelectedDate(normalizedInitialMonth, items, normalizedInitialSelectedDate))
  );

  useEffect(() => {
    const nextMonth = normalizeMonth(initialMonth);
    const nextSelectedDate = getDefaultSelectedDate(
      nextMonth,
      items,
      normalizeDate(initialSelectedDate)
    );
    setCalendarMonth(nextMonth);
    setSelectedDateKey(dateKey(nextSelectedDate));
  }, [initialMonth, initialSelectedDate, items]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const monthLabel = useMemo(
    () =>
      calendarMonth.toLocaleString('en-IN', {
        month: 'long',
        year: 'numeric'
      }),
    [calendarMonth]
  );
  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const selectedItems = useMemo(
    () => items.filter((item) => itemOverlapsDay(item, selectedDate)),
    [items, selectedDate]
  );

  const moveMonth = (offset) => {
    const nextMonth = shiftMonth(calendarMonth, offset);
    setCalendarMonth(nextMonth);
    setSelectedDateKey(dateKey(getDefaultSelectedDate(nextMonth, items)));
  };

  const handleDaySelect = (day) => {
    setSelectedDateKey(dateKey(day));

    if (!isSameMonth(day, calendarMonth)) {
      setCalendarMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    }
  };

  return (
    <section className={`rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-soft ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            <AppIcon className="h-4 w-4" name="chevronLeft" />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            onClick={() => moveMonth(1)}
            type="button"
          >
            <AppIcon className="h-4 w-4" name="chevronRight" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-[1.5rem] bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Viewing Month</p>
        <p className="mt-1 text-xl font-bold text-slate-950">{monthLabel}</p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
        {weekdayLabels.map((day) => (
          <div
            className="py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400"
            key={day}
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dayItems = items.filter((item) => itemOverlapsDay(item, day));
          const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
          const isSelected = selectedDateKey === dateKey(day);

          return (
            <button
              className={`relative aspect-square rounded-[1.1rem] border px-1.5 py-2 text-left transition ${
                isSelected
                  ? 'border-brand-blue bg-brand-mist shadow-soft'
                  : isCurrentMonth
                    ? 'border-slate-200 bg-white hover:border-brand-blue/40 hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50/80 text-slate-400'
              }`.trim()}
              key={day.toISOString()}
              onClick={() => handleDaySelect(day)}
              type="button"
            >
              <span className="flex items-baseline gap-1">
                <span
                  className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-brand-blue'
                      : isCurrentMonth
                        ? 'text-slate-900'
                        : 'text-slate-400'
                  }`.trim()}
                >
                  {day.getDate()}
                </span>
                {showDayMonthTokens ? (
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                      isSelected
                        ? 'text-brand-blue/80'
                        : isCurrentMonth
                          ? 'text-slate-400'
                          : 'text-slate-300'
                    }`.trim()}
                  >
                    {getMonthToken(day)}
                  </span>
                ) : null}
              </span>
              <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1">
                {dayItems.slice(0, 3).map((item) => (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${getItemDotClass(item)}`.trim()}
                    key={`${dateKey(day)}-${getItemId(item)}`}
                  />
                ))}
                {dayItems.length > 3 ? (
                  <span className="text-[10px] font-semibold text-slate-400">+{dayItems.length - 3}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {showSelectionHeader ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
                Selected Date
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">
                {selectedDate.toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
            </div>
            <span className="badge bg-slate-100 text-slate-700">
              {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}
            </span>
          </div>
        ) : null}

        <div className={`${showSelectionHeader ? 'mt-4' : ''} space-y-3`.trim()}>
          {selectedItems.length ? (
            selectedItems.map((item) => (
              <div key={getItemId(item)}>{renderSelectedItem(item)}</div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {emptyDayMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
