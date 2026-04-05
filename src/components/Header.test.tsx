import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche le lien Countdown', () => {
    render(<Header theme="light" onToggleTheme={vi.fn()} />);
    expect(screen.getByRole('link', { name: 'Countdown' })).toBeInTheDocument();
  });

  it('affiche le bouton de bascule thème avec le bon aria-label en mode dark', () => {
    render(<Header theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Enable light mode' })).toBeInTheDocument();
  });

  it('affiche le bouton de bascule thème avec le bon aria-label en mode light', () => {
    render(<Header theme="light" onToggleTheme={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Enable dark mode' })).toBeInTheDocument();
  });

  it('appelle onToggleTheme au clic sur le bouton thème', async () => {
    const user = userEvent.setup();
    const onToggleTheme = vi.fn();
    render(<Header theme="dark" onToggleTheme={onToggleTheme} />);
    await user.click(screen.getByRole('button', { name: 'Enable light mode' }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});
