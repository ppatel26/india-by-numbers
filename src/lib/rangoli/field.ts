/**
 * A rangoli field on a canvas behind a host element: a faint dot grid, and rangoli that bloom along
 * the pointer's path. Every taste decision is in RangoliConfig (src/content/rangoli.json), so the
 * hero and the tuning lab (src/pages/lab/rangoli.astro) draw exactly the same thing.
 */
import { TAU, design, seeded, type Ring } from './generator'

/** A size band: how often it is picked, its radius range in CSS px, and its full opacity. */
export interface Band {
  weight: number
  min: number
  max: number
  opacity: number
}

export interface RangoliConfig {
  /** Pointer travel between two blooms, CSS px. */
  stride: number
  /** Rangoli on screen at once; the oldest goes first. */
  max: number
  /** Size bands, smallest first. A big band can run off the edges of the host. */
  bands: Band[]
  /** Ink names, looked up in the palette the host passes in. */
  inks: string[]
  /** Rings per 100 px of radius (a design has 2 to 9). */
  ringsPer100: number
  /** ms between one ring opening and the next. */
  step: number
  /** ms for a ring to open, plus `growPerPx` for each px of radius: bigger designs open slower. */
  grow: number
  growPerPx: number
  /** ms a design holds once open, then ms to fade. */
  hold: number
  fade: number
  /** Turn while visible, degrees a second. */
  spin: number
  /** Over the hero text: no blooms, only the largest band, or any band. */
  overText: 'none' | 'giant' | 'all'
  /** Opacity of the dot grid. */
  grid: number
}

interface Rangoli {
  x: number
  y: number
  born: number
  spin: number
  turn: number
  rings: Ring[]
  opacity: number
  grow: number
}

const GAP = 30 // dot grid spacing, CSS px

/** A strong ease-out (expo): fast, then a long settle, with no overshoot. */
const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

export interface Field {
  bloom: (x: number, y: number) => void
  setConfig: (c: RangoliConfig) => void
  clear: () => void
}

export function createField(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  palette: Readonly<Record<string, string>>,
  initial: RangoliConfig,
  /** Rectangles (host coordinates) that carry text the rangoli should not crowd. */
  avoid: () => DOMRect[] = () => [],
): Field {
  let config = initial
  const ctx = canvas.getContext('2d')!
  const grid = document.createElement('canvas')
  let w = 0
  let h = 0
  let dpr = 1
  let frame = 0
  let visible = true
  let seed = Math.floor(Math.random() * 1e9)
  const live: Rangoli[] = []

  const size = () => {
    const r = host.getBoundingClientRect()
    dpr = Math.min(devicePixelRatio || 1, 2)
    w = r.width
    h = r.height
    for (const c of [canvas, grid]) {
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
    }
    // The dot grid never changes, so draw it once.
    const g = grid.getContext('2d')!
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)
    g.fillStyle = `rgba(255, 255, 255, ${config.grid})`
    g.beginPath()
    for (let y = (h % GAP) / 2 + GAP / 2; y < h; y += GAP)
      for (let x = (w % GAP) / 2 + GAP / 2; x < w; x += GAP) {
        g.moveTo(x + 1.2, y)
        g.arc(x, y, 1.2, 0, TAU)
      }
    g.fill()
  }

  const draw = (now: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(grid, 0, 0)
    for (let i = live.length - 1; i >= 0; i--) {
      const g = live[i]!
      const age = now - g.born
      const open = g.rings.length * config.step + g.grow
      if (age > open + config.hold + config.fade) {
        live.splice(i, 1)
        continue
      }
      const fade = age > open + config.hold ? 1 - (age - open - config.hold) / config.fade : 1
      ctx.setTransform(dpr, 0, 0, dpr, dpr * g.x, dpr * g.y)
      ctx.rotate(g.turn + (g.spin * age) / 1000)
      g.rings.forEach((paint, j) => {
        const t = Math.min(1, Math.max(0, (age - j * config.step) / g.grow))
        if (t <= 0) return
        ctx.save()
        // Fades start fast and settle, like the entrance; rings open from 60% of their size.
        ctx.globalAlpha = g.opacity * (1 - easeOut(1 - fade)) * Math.min(1, t * 2.2)
        const k = 0.6 + 0.4 * easeOut(t)
        ctx.scale(k, k)
        paint(ctx)
        ctx.restore()
      })
    }
  }

  const tick = (now: number) => {
    frame = 0
    draw(now)
    if (visible && live.length) frame = requestAnimationFrame(tick)
  }
  const wake = () => {
    if (!frame && visible) frame = requestAnimationFrame(tick)
  }

  const bloom = (x: number, y: number) => {
    const rand = seeded(seed++)
    const overText = avoid().some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
    if (overText && config.overText === 'none') return
    const bands = overText && config.overText === 'giant' ? config.bands.slice(-1) : config.bands
    const total = bands.reduce((a, b) => a + b.weight, 0)
    let roll = rand() * total
    const band = bands.find((b) => (roll -= b.weight) <= 0) ?? bands.at(-1)!
    const R = band.min + rand() * (band.max - band.min)
    const count = Math.max(2, Math.min(9, Math.round(1.5 + (R / 100) * config.ringsPer100)))
    const inks = config.inks.flatMap((name) => (palette[name] ? [palette[name]!] : []))
    live.push({
      x,
      y,
      born: performance.now(),
      spin: ((rand() < 0.5 ? -1 : 1) * config.spin * (0.6 + rand() * 0.8) * Math.PI) / 180,
      turn: rand() * TAU,
      rings: design(rand, inks.length ? inks : ['#FFFFFF'], R, count),
      opacity: band.opacity,
      grow: config.grow + R * config.growPerPx,
    })
    while (live.length > config.max) live.shift()
    wake()
  }

  new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) wake()
  }).observe(host)
  new ResizeObserver(() => {
    size()
    draw(performance.now())
  }).observe(host)

  return {
    bloom,
    setConfig: (c) => {
      config = c
      size()
      draw(performance.now())
    },
    clear: () => {
      live.length = 0
      draw(performance.now())
    },
  }
}
