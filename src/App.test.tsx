import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./hooks/useAnalytics', () => ({
  usePageTracking: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche le CTA lorsque la liste est vide', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /ajouter un événement/i })).toBeInTheDocument();
  });

  it('ouvre le formulaire après clic sur le CTA', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /ajouter un événement/i }));
    expect(screen.getByRole('heading', { name: /nouvel événement/i })).toBeInTheDocument();
  });
});
