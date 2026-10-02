import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The web client is served as static assets from ECS (see ../Dockerfile) or,
// once approved, from a private S3 origin behind CloudFront. Build output is
// fully static and must not contain secrets or real patient data.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_PROXY ?? 'http://localhost:8080',
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
});