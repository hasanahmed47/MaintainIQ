import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Listen on all interfaces so the app works from preview hosts / containers
    host: true,
    // Allow the sandbox/preview proxy host (dev server only)
    allowedHosts: true,
  },
});
