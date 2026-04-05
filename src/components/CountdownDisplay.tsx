import { Fragment, type ReactNode } from 'react';
import { THEME_SUBTITLE_COLORS, THEME_TEXT_COLORS } from '../constants';
import type { Theme } from '../constants';
import type { CountdownEvent } from '../types';
import type { DurationParts } from '../utils/countdownTime';
import {
  formatSinceSummary,
  formatUpcomingSummary,
  getElapsedSinceTarget,
  getPhase,
  getRemainingCalendarParts,
  padDurationUnit,
} from '../utils/countdownTime';

const DURATION_LABELS: { key: keyof DurationParts; unit: string }[] = [
  { key: 'years', unit: 'Y' },
  { key: 'months', unit: 'M' },
  { key: 'days', unit: 'D' },
  { key: 'hours', unit: 'H' },
  { key: 'minutes', unit: 'min' },
  { key: 'seconds', unit: 'sec' },
];

const ZERO_DURATION: DurationParts = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function LabeledDurationRow({
  parts,
  variant,
  textColorClass,
}: {
  parts: DurationParts;
  variant: 'card' | 'full';
  textColorClass: string;
}) {
  const digitClass =
    variant === 'full'
      ? `font-mono font-bold tabular-nums text-2xl sm:text-4xl md:text-5xl ${textColorClass}`
      : `font-mono font-semibold tabular-nums text-base sm:text-lg ${textColorClass}`;
  const unitClass =
    variant === 'full'
      ? `text-base font-semibold opacity-90 sm:text-xl md:text-2xl ${textColorClass}`
      : `text-xs font-medium opacity-90 sm:text-sm ${textColorClass}`;

  return (
    <div
      className={`flex flex-wrap items-baseline justify-center gap-x-1 gap-y-2 sm:gap-x-2 ${textColorClass}`}
      role="status"
    >
      {DURATION_LABELS.map(({ key, unit }, i) => (
        <Fragment key={key}>
          {i > 0 && (
            <span
              className={`select-none px-0.5 font-mono text-sm opacity-35 sm:text-base ${textColorClass}`}
              aria-hidden
            >
              ·
            </span>
          )}
          <span className="inline-flex items-baseline gap-0.5">
            <span className={digitClass}>{padDurationUnit(parts[key])}</span>
            <span className={unitClass}>{unit}</span>
          </span>
        </Fragment>
      ))}
    </div>
  );
}

type CountdownDisplayProps = {
  theme: Theme;
  event: CountdownEvent;
  nowMs: number;
  /** Tailles compactes (carte) ou immersives (vue pleine) */
  variant?: 'card' | 'full';
};

export default function CountdownDisplay({
  theme,
  event,
  nowMs,
  variant = 'card',
}: CountdownDisplayProps) {
  const text = THEME_TEXT_COLORS[theme];
  const sub = THEME_SUBTITLE_COLORS[theme];
  const phase = getPhase(nowMs, event.targetAtMs);

  const subClass =
    variant === 'full'
      ? `mt-5 text-center text-lg sm:text-2xl ${sub}`
      : `mt-2 text-center text-sm ${sub}`;

  let body: ReactNode;

  if (phase === 'upcoming') {
    const from = new Date(nowMs);
    const to = new Date(event.targetAtMs);
    const parts = getRemainingCalendarParts(from, to) ?? ZERO_DURATION;
    const leftMs = event.targetAtMs - nowMs;
    const summary = formatUpcomingSummary(parts, leftMs);

    body = (
      <>
        <LabeledDurationRow parts={parts} variant={variant} textColorClass={text} />
        <p className={subClass}>{summary}</p>
      </>
    );
  } else if (phase === 'at_deadline') {
    body = (
      <>
        <LabeledDurationRow parts={ZERO_DURATION} variant={variant} textColorClass={text} />
        <p className={subClass}>C’est l’heure !</p>
      </>
    );
  } else {
    const elapsed = getElapsedSinceTarget(event.targetAtMs, nowMs);
    const parts = elapsed ?? ZERO_DURATION;
    const summary = formatSinceSummary(elapsed);

    body = (
      <>
        <LabeledDurationRow parts={parts} variant={variant} textColorClass={text} />
        <p className={subClass}>{summary}</p>
      </>
    );
  }

  return <div className={variant === 'full' ? 'px-4' : undefined}>{body}</div>;
}
