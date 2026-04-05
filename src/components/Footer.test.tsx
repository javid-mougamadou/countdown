import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('affiche le lien vers Javid Mougamadou', () => {
    render(<Footer theme="light" />);
    const link = screen.getByRole('link', { name: 'Javid Mougamadou - Creator' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://javid-mougamadou.pro/');
  });

  it('affiche le lien vers Javid Spaces', () => {
    render(<Footer theme="light" />);
    const links = screen.getAllByRole('link');
    const spacesLink = links.find((l) => l.getAttribute('href') === 'https://javid-space.cloud/');
    expect(spacesLink).toBeDefined();
  });

  it('affiche le lien vers DaisyUI', () => {
    render(<Footer theme="light" />);
    const links = screen.getAllByRole('link');
    const daisyLink = links.find((l) => l.getAttribute('href') === 'https://daisyui.com/');
    expect(daisyLink).toBeDefined();
  });
});
