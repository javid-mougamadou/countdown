/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#4f46e5',
          'primary-content': '#ffffff',
          'base-100': '#f8fafc',
          'base-content': '#0f172a',
          neutral: '#475569',
          'neutral-content': '#f8fafc',
        },
      },
      {
        dark: {
          primary: '#818cf8',
          'primary-content': '#0f172a',
          'base-100': '#0f172a',
          'base-content': '#e2e8f0',
          neutral: '#1e293b',
          'neutral-content': '#e2e8f0',
        },
      },
    ],
  },
};
