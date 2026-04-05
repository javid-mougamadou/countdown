export type Theme = 'light' | 'dark';

/** Slate → indigo gradient (distinct from Focus forest green) */
export const THEME_GRADIENT_CLASSES: Record<Theme, string> = {
  light: 'bg-gradient-to-br from-slate-100 via-slate-200 to-indigo-200',
  dark: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
};

export const THEME_TEXT_COLORS: Record<Theme, string> = {
  light: 'text-slate-900',
  dark: 'text-slate-100',
};

export const THEME_ICON_COLORS: Record<Theme, string> = {
  light: 'text-slate-800',
  dark: 'text-indigo-100',
};

export const THEME_SUBTITLE_COLORS: Record<Theme, string> = {
  light: 'text-slate-700',
  dark: 'text-indigo-200/90',
};

export const THEME_FOOTER_COLORS: Record<Theme, { text: string; link: string }> = {
  light: { text: 'text-slate-800/85', link: 'text-indigo-800' },
  dark: { text: 'text-slate-300/85', link: 'text-indigo-200' },
};

export const THEME_BLOCK_CLASSES: Record<Theme, string> = {
  light:
    'rounded-2xl bg-white/95 shadow-xl text-slate-900 [&_input]:text-slate-900 [&_input]:border-slate-300 [&_input]:bg-white [&_.label-text]:text-slate-800',
  dark: 'rounded-2xl bg-slate-900/90 shadow-xl text-slate-100 [&_input]:text-slate-100 [&_input]:border-indigo-500/40 [&_input]:bg-slate-950 [&_.label-text]:text-slate-200',
};
