/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    manifest: true,
    // The Three.js renderer (~600 kB raw) is a lazy, map-only chunk by design.
    chunkSizeWarningLimit: 650,
    rolldownOptions: {
      onwarn(warning, warn) {
        // react-router ships "use client" directives that are irrelevant to this SPA.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
  // Keep container builds within a small memory budget.
  test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node', maxWorkers: 1 },
});
