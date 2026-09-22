import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/dist/**'],
    typecheck: {
      enabled: true,
      include: ['test/**/*.test-d.ts'],
      tsconfig: './tsconfig.json'
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/config-entry.ts'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 95, functions: 95, branches: 90, statements: 95 }
    }
  }
})
