// @ts-check
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://indiabynumbers.org',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { format: 'directory' },
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
  },
})
