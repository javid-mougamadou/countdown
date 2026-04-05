import { useEffect, useMemo, useState } from 'react';
import {
  Header,
  Footer,
  CountdownForm,
  CountdownCard,
  CountdownDisplay,
  CarouselArrow,
} from './components';
import { useTheme } from './hooks/useTheme';
import { usePageTracking } from './hooks/useAnalytics';
import { usePersistentState } from './hooks/usePersistentState';
import { useCountdownTick } from './hooks/useCountdownTick';
import { THEME_GRADIENT_CLASSES } from './constants';
import type { CountdownEvent } from './types';

const EVENTS_STORAGE_KEY = 'countdown.events-v1';

function sortEvents(events: CountdownEvent[], nowMs: number): CountdownEvent[] {
  const upcoming = events
    .filter((e) => e.targetAtMs > nowMs)
    .sort((a, b) => a.targetAtMs - b.targetAtMs);
  const done = events
    .filter((e) => e.targetAtMs <= nowMs)
    .sort((a, b) => b.targetAtMs - a.targetAtMs);
  return [...upcoming, ...done];
}

const App = () => {
  const { theme, toggleTheme } = useTheme();
  usePageTracking('/', 'Countdown | Javid Mougamadou');
  const [events, setEvents] = usePersistentState<CountdownEvent[]>({
    key: EVENTS_STORAGE_KEY,
    defaultValue: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CountdownEvent | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [fullView, setFullView] = usePersistentState<boolean>({
    key: 'countdown.fullView-v1',
    defaultValue: false,
  });

  const nowMs = useCountdownTick(events);
  const ordered = useMemo(() => sortEvents(events, nowMs), [events, nowMs]);
  const length = ordered.length;
  const clampedIndex = length > 0 ? Math.min(carouselIndex, length - 1) : 0;
  const current = ordered[clampedIndex] ?? null;
  const hasMultiple = length >= 2;

  useEffect(() => {
    setCarouselIndex((i) => Math.min(i, Math.max(0, length - 1)));
  }, [length]);

  useEffect(() => {
    if (events.length === 0 && fullView) {
      setFullView(false);
    }
  }, [events.length, fullView, setFullView]);

  useEffect(() => {
    if (showForm && fullView) {
      setFullView(false);
    }
  }, [showForm, fullView, setFullView]);

  useEffect(() => {
    if (!fullView) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullView(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [fullView]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSubmit = (ev: CountdownEvent) => {
    setEvents((prev) => {
      const exists = prev.some((p) => p.id === ev.id);
      if (exists) {
        return prev.map((p) => (p.id === ev.id ? ev : p));
      }
      return [...prev, ev];
    });
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((p) => p.id !== id));
  };

  const goPrev = () => {
    if (!hasMultiple) return;
    setCarouselIndex((i) => {
      const safe = Math.min(i, length - 1);
      return safe > 0 ? safe - 1 : length - 1;
    });
  };

  const goNext = () => {
    if (!hasMultiple) return;
    setCarouselIndex((i) => {
      const safe = Math.min(i, length - 1);
      return safe < length - 1 ? safe + 1 : 0;
    });
  };

  const gradient = THEME_GRADIENT_CLASSES[theme];

  const createBlockClass =
    theme === 'dark'
      ? 'rounded-2xl bg-indigo-950/90 px-8 py-4 text-lg font-medium text-indigo-100 shadow-xl transition hover:bg-indigo-900/90'
      : 'rounded-2xl bg-white/90 px-8 py-4 text-lg font-medium text-slate-800 shadow-xl transition hover:bg-slate-50/95';

  return (
    <div className={`flex min-h-screen flex-col ${gradient}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex flex-1 flex-col items-center px-4 pt-20 pb-12">
        {showForm ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <CountdownForm
              theme={theme}
              initialEvent={editing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        ) : events.length === 0 ? (
          <button
            type="button"
            className="flex flex-1 items-center justify-center"
            onClick={openCreate}
          >
            <span className={createBlockClass}>Ajouter un événement</span>
          </button>
        ) : (
          <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" className="btn btn-primary btn-lg shadow-lg" onClick={openCreate}>
                Ajouter un événement
              </button>
              {current && (
                <button
                  type="button"
                  className="btn btn-outline btn-lg shadow-lg"
                  onClick={() => setFullView(true)}
                >
                  Vue pleine
                </button>
              )}
            </div>

            {current && (
              <p className="text-center text-sm opacity-80">
                Événement {clampedIndex + 1} sur {length}
              </p>
            )}

            {current && (
              <div className="flex w-full max-w-2xl items-center justify-center gap-1 sm:gap-2">
                <CarouselArrow direction="prev" onClick={goPrev} disabled={!hasMultiple} />
                <div className="flex min-w-0 flex-1 justify-center">
                  <CountdownCard
                    theme={theme}
                    event={current}
                    nowMs={nowMs}
                    onEdit={() => {
                      setEditing(current);
                      setShowForm(true);
                    }}
                    onDelete={() => handleDelete(current.id)}
                  />
                </div>
                <CarouselArrow direction="next" onClick={goNext} disabled={!hasMultiple} />
              </div>
            )}
          </div>
        )}
        <Footer theme={theme} />
      </main>

      {fullView && current && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullview-countdown-label"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden />
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 justify-end p-3 sm:p-4">
              <button
                type="button"
                className={
                  theme === 'dark'
                    ? 'btn btn-lg border border-white/20 bg-slate-900 text-indigo-50 shadow-lg hover:bg-slate-800'
                    : 'btn btn-lg border border-slate-300 bg-white text-slate-900 shadow-lg hover:bg-slate-50'
                }
                onClick={() => setFullView(false)}
              >
                Fermer
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-12 sm:pb-16">
              <div
                className={
                  theme === 'dark'
                    ? 'w-full max-w-4xl rounded-3xl border border-indigo-400/20 bg-slate-950/95 p-8 shadow-2xl sm:p-12'
                    : 'w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl sm:p-12'
                }
              >
                <span id="fullview-countdown-label" className="sr-only">
                  Décompte plein écran
                </span>
                <CountdownDisplay
                  theme={theme}
                  event={current}
                  nowMs={nowMs}
                  variant="full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
