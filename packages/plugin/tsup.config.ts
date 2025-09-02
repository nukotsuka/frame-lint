import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],
  outDir: 'dist',
  minify: false,
  clean: true,
  noExternal: [/.*/],
  outExtension() {
    return {
      js: '.js',
    }
  },
})