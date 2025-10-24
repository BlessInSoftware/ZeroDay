import React, { useEffect, useState, useMemo } from 'react';
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
    [history]
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
    <div className='bg-black text-white rounded-lg max-w-3xl w-full shadow-xl divide-y-2 divide-gray-900'>
      <div className='relative bg-black text-center rounded-t-lg py-3'>
        <div className='absolute left-4 top-1/2 -translate-y-1/2'>
          <span
            className={['block w-3.5 h-3.5 rounded-full  animate-ping opacity-40 absolute', bgColor].join(' ')}
          ></span>
          <span className={['block w-3.5 h-3.5 rounded-full relative', bgColor].join(' ')}></span>
        </div>

        <span className='opacity-60 mr-2'>Days since</span>
        <span className='font-bold text-l'>{title}</span>
        <span className='relative group cursor-pointer' tabIndex={0} aria-label='Info'>
          <Info className='ml-1 text-blue-500' />
          <span
            className='absolute left-1/2 top-full z-10 mt-2 w-40 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity'
            role='tooltip'
          >
            {description}
          </span>
        </span>

        <div className='absolute right-4 top-1/2 -translate-y-1/2'>
          <span
            className={['block w-3.5 h-3.5 rounded-full  animate-ping opacity-40 absolute', bgColor].join(' ')}
          ></span>
          <span className={['block w-3.5 h-3.5 rounded-full relative', bgColor].join(' ')}></span>
        </div>
      </div>

      <div className='bg-white flex justify-center'>
        <div className='flex w-full divide-x-2 divide-gray-900'>
          {daysString.split('').map((digit, index) => (
            <span
              key={index}
              className={[
                WdxlLubrifontJpN.className,
                'bg-white text-black text-6xl leading-none flex items-center justify-center w-16 h-24 flex-1',
              ].join(' ')}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>
      <div
        className={[
          'bg-yellow-200 overflow-hidden transition-[max-height,padding,overflow] duration-300',
          showAccordion ? 'max-h-48 overflow-y-auto px-4 py-3' : 'max-h-0 p-0 pointer-events-none',
        ].join(' ')}
      >
        {(() => {
          const sortedReversedHistory = [...sortedHistory].reverse();
          const entriesToShow = sortedReversedHistory.length > 1 ? sortedReversedHistory.slice(1) : [];

          if (!entriesToShow.length) {
            return <p className='text-center text-gray-600'>No history yet.</p>;
          }
          return (
            <ol className='relative border-s border-gray-200 dark:border-gray-700 space-y-3'>
              {entriesToShow.map((value, index) => (
                <li key={index} className='ms-4'>
                  <div className='absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700'></div>
                  <time className='mb-1 text-sm font-normal leading-none text-gray-700 '>
                    {value.toLocaleString()} (
                    <span>{timeAgo({ pastDate: value, targetDate: now, alwaysRelative: true })}</span>)
                  </time>
                </li>
              ))}
            </ol>
          );
        })()}
      </div>
      <div className='bg-yellow-400 rounded-b-lg text-black text-center py-3 px-4 text-base flex'>
        <div className='flex-3 grow-3 flex flex-col items-start justify-center space-y-1'>
          <div className='flex items-center'>
            <span className='opacity-60 mr-1'>Last:</span>
            <span>{relative}</span>
          </div>
          {sortedHistory.length > 1 && (
            <div className='flex items-center'>
              <span className='opacity-60 mr-1'>Record:</span>
              <span>{longestDaysRecord({ history: sortedHistory, now })} days</span>
            </div>
          )}
        </div>
        <div className='flex-1 grow flex items-center justify-end gap-2'>
          <button aria-label='Delete' className='bg-black text-red-400 px-3 py-1 rounded hover:bg-gray-800 transition'>
            <span aria-hidden='true'>
              <DeleteForever />
            </span>
          </button>
          <button
            aria-label='Reset'
            className='bg-black text-blue-400 px-3 py-1 rounded hover:bg-gray-800 transition'
            onClick={() => resetDate()}
          >
            <span aria-hidden='true'>
              <RestartAlt />
            </span>
          </button>
          <button
            aria-label={showAccordion ? 'Collapse section' : 'Expand section'}
            aria-expanded={showAccordion}
            className='bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition'
            onClick={() => setShowAccordion(!showAccordion)}
          >
            <span aria-hidden='true'>{showAccordion ? <ExpandLess /> : <ExpandMore />}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
