import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  treeshake: true,
  define: {
    'import.meta.vitest': 'false',
  },
})
