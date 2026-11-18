// @ts-check
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://india-by-numbers.ppatel26.workers.dev',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory' },
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
  },
})
