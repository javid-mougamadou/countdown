import { useState } from 'react';
import { THEME_BLOCK_CLASSES } from '../constants';
import type { Theme } from '../constants';
import type { CountdownEvent } from '../types';
import {
  fromDatetimeLocalValue,
  joinDateAndTimeForLocalInput,
  splitDatetimeLocalValue,
  toDatetimeLocalValue,
} from '../utils/countdownTime';

type CountdownFormProps = {
  theme: Theme;
  initialEvent?: CountdownEvent | null;
  onSubmit: (event: CountdownEvent) => void;
  onCancel?: () => void;
};

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CountdownForm({
  theme,
  initialEvent,
  onSubmit,
  onCancel,
}: CountdownFormProps) {
  const defaultTarget = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 60, 0, 0);
    return d.getTime();
  };

  const initialLocal = toDatetimeLocalValue(initialEvent?.targetAtMs ?? defaultTarget());
  const initialParts = splitDatetimeLocalValue(initialLocal);

  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [targetDate, setTargetDate] = useState(initialParts.date);
  const [targetTime, setTargetTime] = useState(initialParts.time);

  const formBlockClass = `${THEME_BLOCK_CLASSES[theme]} p-6`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim() || 'Événement';
    const combined = joinDateAndTimeForLocalInput(targetDate, targetTime);
    const targetAtMs = fromDatetimeLocalValue(combined);
    if (Number.isNaN(targetAtMs)) {
      return;
    }
    onSubmit({
      id: initialEvent?.id ?? newId(),
      title: trimmed,
      targetAtMs,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md flex-col items-center gap-6 ${formBlockClass}`}
    >
      <h2 className="text-xl font-semibold">
        {initialEvent ? 'Modifier l’événement' : 'Nouvel événement'}
      </h2>

      <div className="w-full">
        <label htmlFor="cd-title" className="label">
          <span className="label-text">Titre</span>
        </label>
        <input
          id="cd-title"
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Ex : Vacances, Lancement…"
          className="input input-bordered w-full"
          autoFocus
        />
      </div>

      <div className="w-full">
        <p className="label pt-0">
          <span className="label-text">Date et heure (fuseau local)</span>
        </p>
        <p className="mb-3 text-xs opacity-70">
          Utilise le calendrier et l’horloge du navigateur : deux champs séparés pour choisir le jour
          puis l’heure.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-control w-full">
            <label htmlFor="cd-target-date" className="label py-1">
              <span className="label-text text-sm font-medium">Date</span>
            </label>
            <input
              id="cd-target-date"
              type="date"
              value={targetDate}
              onChange={(ev) => setTargetDate(ev.target.value)}
              className="input input-bordered w-full min-h-12"
              required
            />
          </div>
          <div className="form-control w-full">
            <label htmlFor="cd-target-time" className="label py-1">
              <span className="label-text text-sm font-medium">Heure</span>
            </label>
            <input
              id="cd-target-time"
              type="time"
              value={targetTime}
              onChange={(ev) => setTargetTime(ev.target.value)}
              className="input input-bordered w-full min-h-12"
              step={60}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialEvent ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}
