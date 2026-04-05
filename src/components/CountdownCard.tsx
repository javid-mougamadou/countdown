import EditIcon from './icons/EditIcon';
import CountdownDisplay from './CountdownDisplay';
import { THEME_SUBTITLE_COLORS, THEME_TEXT_COLORS } from '../constants';
import type { Theme } from '../constants';
import type { CountdownEvent } from '../types';
import { getPhase } from '../utils/countdownTime';

type CountdownCardProps = {
  theme: Theme;
  event: CountdownEvent;
  nowMs: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CountdownCard({
  theme,
  event,
  nowMs,
  onEdit,
  onDelete,
}: CountdownCardProps) {
  const text = THEME_TEXT_COLORS[theme];
  const sub = THEME_SUBTITLE_COLORS[theme];
  const phase = getPhase(nowMs, event.targetAtMs);

  const cardBase =
    theme === 'dark'
      ? 'card border border-indigo-500/20 bg-base-100/95 shadow-xl'
      : 'card border border-slate-200 bg-base-100/95 shadow-xl';

  const expiredRing =
    phase === 'passed' || phase === 'at_deadline'
      ? 'ring-1 ring-indigo-400/40'
      : '';

  return (
    <div className={`${cardBase} ${expiredRing} w-full max-w-lg`}>
      <div className="card-body gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className={`card-title text-lg ${text}`}>{event.title}</h3>
            <p className={`text-xs opacity-70 ${sub}`}>
              {new Date(event.targetAtMs).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            {(phase === 'passed' || phase === 'at_deadline') && (
              <span className="badge badge-neutral whitespace-nowrap">Terminé</span>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <CountdownDisplay theme={theme} event={event} nowMs={nowMs} variant="card" />
        </div>

        <div className="card-actions justify-end gap-2 pt-2">
          <button type="button" className="btn btn-ghost btn-sm gap-1" onClick={onEdit}>
            <EditIcon size="sm" className={text} />
            Modifier
          </button>
          <button type="button" className="btn btn-ghost btn-sm text-error" onClick={onDelete}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
