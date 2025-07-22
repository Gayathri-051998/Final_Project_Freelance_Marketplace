import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://final-project-freelance-marketplace.onrender.com',
    },
  },
  build: {
    sourcemap: true, // ✅ This enables useful stack traces in Netlify builds
  },
});
