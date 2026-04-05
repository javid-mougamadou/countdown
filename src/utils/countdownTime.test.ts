import { describe, it, expect } from 'vitest';
import {
  AT_DEADLINE_MS,
  formatBreakdown,
  formatLabeledDurationParts,
  formatSinceSummary,
  formatUpcomingSummary,
  fromDatetimeLocalValue,
  getElapsedSinceTarget,
  getPhase,
  getRemainingCalendarParts,
  msUntilNextRelevantTick,
  joinDateAndTimeForLocalInput,
  splitDatetimeLocalValue,
  toDatetimeLocalValue,
} from './countdownTime';

describe('countdownTime', () => {
  it('getPhase: upcoming avant la cible', () => {
    expect(getPhase(1000, 2000)).toBe('upcoming');
  });

  it('getPhase: at_deadline dans la fenêtre après la cible', () => {
    const target = 1000;
    expect(getPhase(target, target)).toBe('at_deadline');
    expect(getPhase(target + AT_DEADLINE_MS - 1, target)).toBe('at_deadline');
  });

  it('getPhase: passed après la fenêtre', () => {
    const target = 1000;
    expect(getPhase(target + AT_DEADLINE_MS, target)).toBe('passed');
  });

  it('msUntilNextRelevantTick: 1000 ms dès qu’il y a un événement à venir (< 24 h)', () => {
    const now = 0;
    const events = [{ targetAtMs: 12 * 60 * 60 * 1000 }];
    expect(msUntilNextRelevantTick(events, now)).toBe(1000);
  });

  it('msUntilNextRelevantTick: 1000 ms pour un événement à venir même à plus de 24 h', () => {
    const now = 0;
    const events = [{ targetAtMs: 25 * 60 * 60 * 1000 }];
    expect(msUntilNextRelevantTick(events, now)).toBe(1000);
  });

  it('msUntilNextRelevantTick: 1000 ms si tous passés mais écart sous 24 h', () => {
    const target = 1000;
    const now = target + 12 * 60 * 60 * 1000;
    const events = [{ targetAtMs: target }];
    expect(msUntilNextRelevantTick(events, now)).toBe(1000);
  });

  it('msUntilNextRelevantTick: 60000 ms si tous passés depuis plus de 24 h', () => {
    const target = 1000;
    const now = target + 25 * 60 * 60 * 1000;
    const events = [{ targetAtMs: target }];
    expect(msUntilNextRelevantTick(events, now)).toBe(60_000);
  });

  it('msUntilNextRelevantTick: liste vide → 60000', () => {
    expect(msUntilNextRelevantTick([], 0)).toBe(60_000);
  });

  it('getRemainingCalendarParts: décomposition cohérente', () => {
    const from = new Date('2026-01-01T12:00:00');
    const to = new Date('2026-01-03T14:30:45');
    const p = getRemainingCalendarParts(from, to);
    expect(p).not.toBeNull();
    expect(p!.days).toBe(2);
    expect(p!.hours).toBe(2);
    expect(p!.minutes).toBe(30);
    expect(p!.seconds).toBe(45);
  });

  it('formatBreakdown: saute les zéros en tête', () => {
    const parts = { years: 0, months: 0, days: 2, hours: 1, minutes: 0, seconds: 3 };
    expect(formatBreakdown(parts, 'seconds')).toMatch(/2 jours/);
    expect(formatBreakdown(parts, 'seconds')).toMatch(/1 heure/);
    expect(formatBreakdown(parts, 'seconds')).toMatch(/3 secondes/);
  });

  it('formatUpcomingSummary', () => {
    const parts = { years: 0, months: 0, days: 5, hours: 0, minutes: 0, seconds: 0 };
    expect(formatUpcomingSummary(parts, 5 * 86400000)).toContain('5');
  });

  it('formatLabeledDurationParts', () => {
    const parts = { years: 0, months: 1, days: 2, hours: 3, minutes: 4, seconds: 5 };
    expect(formatLabeledDurationParts(parts)).toBe('00Y 01M 02D 03H 04min 05sec');
  });

  it('getElapsedSinceTarget et formatSinceSummary', () => {
    const target = new Date('2026-01-01T00:00:00').getTime();
    const now = new Date('2026-01-03T00:00:00').getTime();
    const elapsed = getElapsedSinceTarget(target, now);
    expect(formatSinceSummary(elapsed)).toMatch(/depuis/);
  });

  it('toDatetimeLocalValue / fromDatetimeLocalValue aller-retour (local)', () => {
    const ms = new Date('2026-06-15T14:30:00').getTime();
    const local = toDatetimeLocalValue(ms);
    const back = fromDatetimeLocalValue(local);
    expect(Math.abs(back - ms)).toBeLessThan(60_000);
  });

  it('splitDatetimeLocalValue / joinDateAndTimeForLocalInput', () => {
    expect(splitDatetimeLocalValue('2026-03-10T08:05')).toEqual({ date: '2026-03-10', time: '08:05' });
    expect(joinDateAndTimeForLocalInput('2026-03-10', '08:05')).toBe('2026-03-10T08:05');
  });
});
