// Turn downloaded publisher logos into trimmed 128 px tall WebP files for the Sources page.
// Usage: node pipeline/logos/make_logos.mjs <download folder> <work folder> <output folder>
// Also writes each logo's pixel size to src/content/logos.json. Run from the repository root.
// SVGs are drawn with resvg, which runs no scripts; nothing downloaded is executed.
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const [src, work, dst] = process.argv.slice(2)
mkdirSync(work, { recursive: true })
mkdirSync(dst, { recursive: true })
// Name on the site <- downloaded file.
const files = {
  mospi: 'mospi.svg', orgi: 'census.jpg', moe: 'moe.svg', rbi: 'rbi-commons.svg', imd: 'imd.webp', eci: 'eci.svg',
  pib: 'pib-commons.jpg', cea: 'cea.webp', iips: 'iips.png', mnre: 'mnre.png', mohfw: 'mohfw.svg',
}
const sizes = {}
for (const [name, file] of Object.entries(files)) {
  const buf = readFileSync(`${src}/${file}`)
  const png = file.endsWith('.svg') ? new Resvg(buf, { fitTo: { mode: 'height', value: 512 }, background: 'rgba(0,0,0,0)' }).render().asPng() : buf
  const trimmed = `${work}/${name}.png`
  await sharp(png).trim({ threshold: 12 }).resize({ height: 256 }).png().toFile(trimmed)
  const info = await sharp(trimmed).resize({ height: 128 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${dst}/${name}.webp`)
  sizes[name] = { width: info.width, height: info.height }
  console.log(name)
}
// The Sources page reads each logo's size, so it can reserve the box before the image loads.
writeFileSync('src/content/logos.json', `${JSON.stringify(sizes, null, 2)}\n`)
