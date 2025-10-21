import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: [
      'node_modules/**', // ❌ exclui node_modules
      'tests/e2e/**', // ❌ exclui testes E2E do Playwright
      '.next/**', // ❌ exclui build do Next
    ],
  },
});
