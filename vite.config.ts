import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base:
    process.env.CUSTOM_DOMAIN === 'true' || process.env.GITHUB_PAGES !== 'true'
      ? '/'
      : `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'countdown'}/`,
  define: {
    'import.meta.env.VITE_NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
  },
});
