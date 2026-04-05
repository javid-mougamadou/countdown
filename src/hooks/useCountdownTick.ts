import { useEffect, useMemo, useState } from 'react';
import { msUntilNextRelevantTick } from '../utils/countdownTime';
import type { CountdownEvent } from '../types';

/**
 * Pilote l’horloge affichée : 1 s tant qu’au moins un événement à venir existe, ou un passé récent (< 24 h).
 * Sinon 60 s. Rafraîchit aussi au focus / retour onglet visible.
 */
export function useCountdownTick(events: CountdownEvent[]): number {
  const [now, setNow] = useState(() => Date.now());

  const intervalMs = useMemo(() => msUntilNextRelevantTick(events, now), [events, now]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return now;
}
