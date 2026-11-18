// @ts-check
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://indiabynumbers.org',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  // Inline the CSS: one round trip less before the first paint.
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
  },
})
