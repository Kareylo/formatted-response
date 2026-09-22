import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/dist/**/*.test.ts'],
    typecheck: { enabled: false }
  }
})
