export type CountdownPhase = 'upcoming' | 'at_deadline' | 'passed';

/** First minute after the target shows the “deadline reached” message */
export const AT_DEADLINE_MS = 60_000;

export type DurationParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const MS_DAY = 24 * 60 * 60 * 1000;

/** Valeurs affichées sur 2 caractères (plafond 99 par unité). */
export function padDurationUnit(n: number): string {
  return String(Math.min(99, Math.max(0, Math.floor(n)))).padStart(2, '0');
}

/** Chaîne unique avec suffixes Y, M, D, H, min, sec (tests / accessibilité). */
export function formatLabeledDurationParts(parts: DurationParts): string {
  const p = padDurationUnit;
  return `${p(parts.years)}Y ${p(parts.months)}M ${p(parts.days)}D ${p(parts.hours)}H ${p(parts.minutes)}min ${p(parts.seconds)}sec`;
}

export function getRemainingCalendarParts(from: Date, to: Date): DurationParts | null {
  if (to.getTime() <= from.getTime()) {
    return null;
  }

  const parts: DurationParts = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  let cursor = new Date(from.getTime());

  while (true) {
    const next = new Date(cursor);
    next.setFullYear(next.getFullYear() + 1);
    if (next > to) {
      break;
    }
    cursor = next;
    parts.years += 1;
  }
  while (true) {
    const next = new Date(cursor);
    next.setMonth(next.getMonth() + 1);
    if (next > to) {
      break;
    }
    cursor = next;
    parts.months += 1;
  }
  while (true) {
    const next = new Date(cursor);
    next.setDate(next.getDate() + 1);
    if (next > to) {
      break;
    }
    cursor = next;
    parts.days += 1;
  }

  let ms = to.getTime() - cursor.getTime();
  parts.hours = Math.floor(ms / 3600000);
  ms %= 3600000;
  parts.minutes = Math.floor(ms / 60000);
  ms %= 60000;
  parts.seconds = Math.floor(ms / 1000);
  return parts;
}

export function getElapsedSinceTarget(targetMs: number, nowMs: number): DurationParts | null {
  return getRemainingCalendarParts(new Date(targetMs), new Date(nowMs));
}

export function getPhase(nowMs: number, targetMs: number): CountdownPhase {
  if (nowMs < targetMs) {
    return 'upcoming';
  }
  if (nowMs - targetMs < AT_DEADLINE_MS) {
    return 'at_deadline';
  }
  return 'passed';
}

/**
 * Intervalle de rafraîchissement de l’horloge UI.
 * - Dès qu’il existe un événement **à venir** : 1 s (le décompte affiche des secondes vivantes).
 * - Sinon, événements passés seulement : 1 s si l’écart depuis la cible est < 24 h pour au moins un
 *   événement (affichage « depuis » précis), sinon 60 s.
 */
export function msUntilNextRelevantTick(events: { targetAtMs: number }[], nowMs: number): number {
  if (events.length === 0) {
    return 60_000;
  }
  for (const e of events) {
    if (nowMs < e.targetAtMs) {
      return 1000;
    }
  }
  for (const e of events) {
    const elapsed = nowMs - e.targetAtMs;
    if (elapsed < MS_DAY) {
      return 1000;
    }
  }
  return 60_000;
}

const ORDER: (keyof DurationParts)[] = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
];

const LABELS: Record<keyof DurationParts, { one: string; many: string }> = {
  years: { one: 'an', many: 'ans' },
  months: { one: 'mois', many: 'mois' },
  days: { one: 'jour', many: 'jours' },
  hours: { one: 'heure', many: 'heures' },
  minutes: { one: 'minute', many: 'minutes' },
  seconds: { one: 'seconde', many: 'secondes' },
};

function firstNonZeroIndex(parts: DurationParts): number {
  for (let i = 0; i < ORDER.length; i += 1) {
    if (parts[ORDER[i]] > 0) {
      return i;
    }
  }
  return ORDER.length;
}

/** Human-readable breakdown; skips leading zeros; `precision` caps smallest unit shown */
export function formatBreakdown(
  parts: DurationParts,
  precision: 'seconds' | 'minutes' | 'hours',
): string {
  const precisionIndex =
    precision === 'seconds' ? 5 : precision === 'minutes' ? 4 : 3;
  const start = firstNonZeroIndex(parts);
  if (start > precisionIndex) {
    return '0 seconde';
  }
  const end = Math.min(precisionIndex, ORDER.length - 1);
  const segments: string[] = [];
  for (let i = start; i <= end; i += 1) {
    const key = ORDER[i];
    const n = parts[key];
    if (n === 0 && segments.length > 0) {
      continue;
    }
    if (n === 0) {
      continue;
    }
    const { one, many } = LABELS[key];
    segments.push(`${n} ${n === 1 ? one : many}`);
  }
  return segments.length > 0 ? segments.join(', ') : '0 seconde';
}

/** Short summary for upcoming events (French) */
export function formatUpcomingSummary(parts: DurationParts, totalMs: number): string {
  if (parts.years >= 1) {
    return parts.years === 1 ? 'dans environ 1 an' : `dans environ ${parts.years} ans`;
  }
  if (parts.months >= 1) {
    return `dans environ ${parts.months} mois`;
  }
  if (parts.days >= 1) {
    return parts.days === 1 ? 'dans 1 jour' : `dans ${parts.days} jours`;
  }
  if (parts.hours >= 1) {
    return parts.hours === 1 ? 'dans 1 heure' : `dans ${parts.hours} heures`;
  }
  if (parts.minutes >= 1) {
    return parts.minutes === 1 ? 'dans 1 minute' : `dans ${parts.minutes} minutes`;
  }
  if (totalMs < MS_DAY) {
    return 'moins d’une minute';
  }
  return 'bientôt';
}

export function formatSinceSummary(parts: DurationParts | null): string {
  if (!parts) {
    return 'à l’instant';
  }
  const start = firstNonZeroIndex(parts);
  if (start >= ORDER.length) {
    return 'à l’instant';
  }
  const key = ORDER[start];
  const n = parts[key];
  const { one, many } = LABELS[key];
  const unit = n === 1 ? one : many;
  return `depuis ${n} ${unit}`;
}

export function toDatetimeLocalValue(ms: number): string {
  const d = new Date(ms);
  const pad = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Découpe une valeur `datetime-local` en champs `date` / `time` pour `<input type="date">` et `<input type="time">`. */
export function splitDatetimeLocalValue(isoDatetimeLocal: string): { date: string; time: string } {
  const [date = '', rest = '12:00'] = isoDatetimeLocal.split('T');
  const time = rest.slice(0, 5);
  return { date, time };
}

export function joinDateAndTimeForLocalInput(date: string, time: string): string {
  return `${date}T${time}`;
}

export function fromDatetimeLocalValue(value: string): number {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? NaN : t;
}
