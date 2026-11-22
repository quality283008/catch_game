import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true },
  // Phaser alone is ~1.4MB minified (~340KB gzip).
  build: { chunkSizeWarningLimit: 1600 },
});
