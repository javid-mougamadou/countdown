import { describe, it, expect } from 'vitest';
import {
  THEME_TEXT_COLORS,
  THEME_ICON_COLORS,
  THEME_FOOTER_COLORS,
  THEME_BLOCK_CLASSES,
  THEME_GRADIENT_CLASSES,
} from './theme';

describe('theme constants', () => {
  it('THEME_TEXT_COLORS définit light et dark', () => {
    expect(THEME_TEXT_COLORS.light).toBeDefined();
    expect(THEME_TEXT_COLORS.dark).toBeDefined();
  });

  it('THEME_ICON_COLORS définit light et dark', () => {
    expect(THEME_ICON_COLORS.light).toBeDefined();
    expect(THEME_ICON_COLORS.dark).toBeDefined();
  });

  it('THEME_FOOTER_COLORS définit text et link pour chaque thème', () => {
    expect(THEME_FOOTER_COLORS.light).toHaveProperty('text');
    expect(THEME_FOOTER_COLORS.light).toHaveProperty('link');
    expect(THEME_FOOTER_COLORS.dark).toHaveProperty('text');
    expect(THEME_FOOTER_COLORS.dark).toHaveProperty('link');
  });

  it('THEME_BLOCK_CLASSES contient des classes Tailwind', () => {
    expect(THEME_BLOCK_CLASSES.light).toContain('rounded-2xl');
    expect(THEME_BLOCK_CLASSES.dark).toContain('rounded-2xl');
  });

  it('THEME_GRADIENT_CLASSES définit light et dark', () => {
    expect(THEME_GRADIENT_CLASSES.light).toBeDefined();
    expect(THEME_GRADIENT_CLASSES.dark).toBeDefined();
  });
});
