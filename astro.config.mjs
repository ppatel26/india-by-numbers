// @ts-check
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://india-by-numbers.parv-personal.workers.dev',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory' },
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
  },
})
