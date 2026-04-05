import { useEffect, useState, useMemo } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import { WDXL_Lubrifont_JP_N } from 'next/font/google';
import { Incident } from '@/types/global';
import { DeleteForever, ExpandMore, ExpandLess, RestartAlt, Info } from '@mui/icons-material';

const WdxlLubrifontJpN = WDXL_Lubrifont_JP_N({
  subsets: ['latin'],
  weight: ['400'],
});

export function Counter({ props: { title, history, description } }: { props: Incident }) {
  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => a.epochMilliseconds - b.epochMilliseconds),
    [history],
  );

  const [shownDate, setShownDate] = useState<Temporal.Instant>(sortedHistory.at(-1) || Temporal.Now.instant());
  const [now, setNow] = useState(() => Temporal.Now.instant());
  const [showAccordion, setShowAccordion] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Temporal.Now.instant());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function resetDate() {
    const now = Temporal.Now.instant();
    sortedHistory.push(now);
    setShownDate(now);
  }

  function getBgColor(days: number) {
    if (days < 7) return 'bg-red-400';
    if (days < 30) return 'bg-yellow-400';
    if (days < 183) return 'bg-green-400';
    if (days >= 365) return 'bg-blue-400';
    return 'bg-green-500';
  }

  function timeAgo({
    pastDate,
    targetDate,
    alwaysRelative,
  }: {
    pastDate: Temporal.Instant;
    targetDate: Temporal.Instant;
    alwaysRelative?: boolean;
  }) {
    const dateDiff = targetDate.since(pastDate, { largestUnit: 'auto' });
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;

    const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
    });
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ['second', 60],
      ['minute', 60],
      ['hour', 24],
      ['day', 30],
      ['month', 12],
      ['year', Number.POSITIVE_INFINITY],
    ];
    let delta = (targetDate.epochMilliseconds - pastDate.epochMilliseconds) / 1000;

    if (alwaysRelative) {
      let value = delta;
      for (const [unit, limit] of units) {
        if (Math.abs(value) < limit) {
          return relativeTimeFormat.format(-Math.round(value), unit);
        }
        value /= limit;
      }
    } else {
      if (dateDiff.months >= 1 || dateDiff.years >= 1) {
        const date = pastDate.toZonedDateTimeISO(timeZone);
        return date.toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          weekday: undefined,
        });
      }
      for (const [unit, limit] of units.slice(0, 4)) {
        if (Math.abs(delta) < limit) {
          return relativeTimeFormat.format(-Math.round(delta), unit);
        }
        delta /= limit;
      }
    }

    const date = pastDate.toZonedDateTimeISO(timeZone);
    return date.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function longestDaysRecord({ history, now }: { history: Temporal.Instant[]; now: Temporal.Instant }) {
    if (history.length === 0) return 0;
    if (history.length === 1) {
      const onlyDatePlain = Temporal.PlainDate.from(history[0].toString().slice(0, 10));
      const nowPlain = Temporal.PlainDate.from(now.toString().slice(0, 10));
      return Math.max(0, onlyDatePlain.until(nowPlain).days);
    }
    const sortedReversedHistory = [...sortedHistory].reverse();
    const toPlainDate = (inst: Temporal.Instant) => Temporal.PlainDate.from(inst.toString().slice(0, 10));

    let maxGap = 0;
    for (let i = 0; i < sortedReversedHistory.length - 1; i++) {
      const a = toPlainDate(sortedReversedHistory[i]);
      const b = toPlainDate(sortedReversedHistory[i + 1]);
      const gap = a.until(b).days;
      if (gap > maxGap) maxGap = gap;
    }

    const lastPlain = toPlainDate(sortedReversedHistory[sortedReversedHistory.length - 1]);
    const nowPlain = Temporal.PlainDate.from(now.toString().slice(0, 10));
    const lastGap = lastPlain.until(nowPlain).days;
    if (lastGap > maxGap) maxGap = lastGap;

    return Math.max(0, Math.floor(maxGap));
  }

  const relative = timeAgo({ pastDate: shownDate, targetDate: now });
  const lastIncidentPlainDate = Temporal.PlainDate.from(shownDate.toString().slice(0, 10));
  const todayPlainDate = Temporal.PlainDate.from(now.toString().slice(0, 10));
  const days = lastIncidentPlainDate.until(todayPlainDate).days;
  const daysString = Math.max(0, days).toString().padStart(8, '0');
  const bgColor = getBgColor(days);

  return (
    <div className="w-full max-w-3xl divide-y-2 divide-gray-900 rounded-lg bg-black text-white shadow-xl">
      <div className="relative rounded-t-lg bg-black py-3 text-center">
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <span
            className={['absolute block h-3.5 w-3.5 animate-ping rounded-full opacity-40', bgColor].join(' ')}
          ></span>
          <span className={['relative block h-3.5 w-3.5 rounded-full', bgColor].join(' ')}></span>
        </div>

        <span className="mr-2 opacity-60">Days since</span>
        <span className="text-l font-bold">{title}</span>
        <span className="group relative cursor-pointer" tabIndex={0} aria-label="Info">
          <Info className="ml-1 text-blue-500" />
          <span
            className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 w-40 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
            role="tooltip"
          >
            {description}
          </span>
        </span>

        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <span
            className={['absolute block h-3.5 w-3.5 animate-ping rounded-full opacity-40', bgColor].join(' ')}
          ></span>
          <span className={['relative block h-3.5 w-3.5 rounded-full', bgColor].join(' ')}></span>
        </div>
      </div>

      <div className="flex justify-center bg-white">
        <div className="flex w-full divide-x-2 divide-gray-900">
          {daysString.split('').map((digit, index) => (
            <span
              key={index}
              className={[
                WdxlLubrifontJpN.className,
                'flex h-24 w-16 flex-1 items-center justify-center bg-white text-6xl leading-none text-black',
              ].join(' ')}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>
      <div
        id="history-panel"
        className={[
          'overflow-hidden bg-yellow-200 transition-[max-height,padding,overflow] duration-300',
          showAccordion ? 'max-h-48 overflow-y-auto px-4 py-3' : 'pointer-events-none max-h-0 p-0',
        ].join(' ')}
      >
        {(() => {
          const sortedReversedHistory = [...sortedHistory].reverse();
          const entriesToShow = sortedReversedHistory.length > 1 ? sortedReversedHistory.slice(1) : [];

          if (!entriesToShow.length) {
            return <p className="text-center text-gray-600">No history yet.</p>;
          }
          return (
            <ol className="relative space-y-3 border-s border-gray-200 dark:border-gray-700">
              {entriesToShow.map((value, index) => (
                <li key={index} className="ms-4">
                  <div className="absolute -inset-s-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 text-sm leading-none font-normal text-gray-700">
                    {value.toLocaleString()} (
                    <span>{timeAgo({ pastDate: value, targetDate: now, alwaysRelative: true })}</span>)
                  </time>
                </li>
              ))}
            </ol>
          );
        })()}
      </div>
      <div className="flex rounded-b-lg bg-yellow-400 px-4 py-3 text-center text-base text-black">
        <div className="flex flex-3 grow-3 flex-col items-start justify-center space-y-1">
          <div className="flex items-center">
            <span className="mr-1 opacity-60">Last:</span>
            <span>{relative}</span>
          </div>
          {sortedHistory.length > 1 && (
            <div className="flex items-center">
              <span className="mr-1 opacity-60">Record:</span>
              <span>{longestDaysRecord({ history: sortedHistory, now })} days</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 grow items-center justify-end gap-2">
          <button aria-label="Delete" className="rounded bg-black px-3 py-1 text-red-400 transition hover:bg-gray-800">
            <span aria-hidden="true">
              <DeleteForever />
            </span>
          </button>
          <button
            aria-label="Reset"
            className="rounded bg-black px-3 py-1 text-blue-400 transition hover:bg-gray-800"
            onClick={() => resetDate()}
          >
            <span aria-hidden="true">
              <RestartAlt />
            </span>
          </button>
          {showAccordion ? (
            <button
              aria-label="Collapse section"
              aria-expanded="true"
              aria-controls="history-panel"
              className="rounded bg-black px-3 py-1 text-white transition hover:bg-gray-800"
              onClick={() => {
                setShowAccordion(false);
              }}
            >
              <span aria-hidden="true">
                <ExpandLess />
              </span>
            </button>
          ) : (
            <button
              aria-label="Expand section"
              aria-expanded="false"
              aria-controls="history-panel"
              className="rounded bg-black px-3 py-1 text-white transition hover:bg-gray-800"
              onClick={() => {
                setShowAccordion(true);
              }}
            >
              <span aria-hidden="true">
                <ExpandMore />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Counter;
