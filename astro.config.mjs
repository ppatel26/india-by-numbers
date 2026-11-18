// @ts-check
import { writeFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'

/**
 * Dev server only: the rangoli lab (/lab/rangoli/) posts its settings here, and they are written to
 * src/content/rangoli.json, the file the home hero reads. Nothing like it exists in the build.
 */
const labSave = {
  name: 'lab-save',
  /** @param {{ middlewares: { use: (path: string, fn: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void) => void } }} server */
  configureServer(server) {
    server.middlewares.use('/__lab/rangoli', (req, res) => {
      if (req.method !== 'POST') return void res.writeHead(405).end()
      let body = ''
      req.on('data', (/** @type {Buffer} */ c) => (body += c))
      req.on('end', () => {
        try {
          const config = JSON.parse(body)
          writeFileSync('src/content/rangoli.json', `${JSON.stringify(config, null, 2)}\n`)
          res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ path: 'src/content/rangoli.json' }))
        } catch {
          res.writeHead(400).end()
        }
      })
    })
  },
}

export default defineConfig({
  site: 'https://indiabynumbers.org',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  // Inline the CSS: one round trip less before the first paint.
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: {
    ssr: { external: ['@resvg/resvg-js'] },
    plugins: [labSave],
  },
})
