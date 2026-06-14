import { defineConfig } from 'vitest/config';

// Unit tests only — keep Vitest away from the Playwright e2e/*.spec.ts files.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
