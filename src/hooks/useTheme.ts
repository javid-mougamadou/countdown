import { useEffect } from 'react';
import { usePersistentState } from './usePersistentState';
import type { Theme } from '../constants';

const THEME_STORAGE_KEY = 'focus.theme-v1';

export function useTheme() {
  const [theme, setTheme] = usePersistentState<Theme>({
    key: THEME_STORAGE_KEY,
    defaultValue: 'dark',
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
