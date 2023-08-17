import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    coverage: {
      all: true,
      provider: 'v8',
      exclude: ['src/index.ts'],
    },
    includeSource: ['src/**/*.ts'],
  },
})
