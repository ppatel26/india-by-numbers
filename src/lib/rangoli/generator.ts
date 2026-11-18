/**
 * Rangoli designs: a seeded generator of rings drawn around the origin on a 2D canvas.
 * Shared by the home hero (src/components/home/RangoliField.astro) and the tuning lab
 * (src/pages/lab/rangoli.astro). No DOM access here beyond the canvas context.
 */
export const TAU = Math.PI * 2

export type Ring = (ctx: CanvasRenderingContext2D) => void
interface Spec { n: number; m: number; r0: number; r1: number; fill: string; turn: number; wide: number; stroke: boolean }

/** Every ring shape a design can draw. */
export const KINDS = ['petals', 'teardrops', 'dots', 'scallops', 'diamonds', 'leaves', 'star', 'ring', 'spokes', 'zigzag', 'veined', 'squares', 'arcs', 'crescents'] as const

/** A small seeded generator (mulberry32), so a design is fixed once it is born. */
export const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** The drawing for one ring. Every shape repeats around the circle with the ring's symmetry. */
function ring(kind: string, s: Spec): Ring {
  const around = (ctx: CanvasRenderingContext2D, count: number, shape: () => void) => {
    for (let i = 0; i < count; i++) {
      ctx.save()
      ctx.rotate(s.turn + (i * TAU) / count)
      shape()
      ctx.restore()
    }
  }
  const mid = (s.r0 + s.r1) / 2
  const len = s.r1 - s.r0
  const paint = (ctx: CanvasRenderingContext2D) => {
    if (s.stroke) {
      ctx.strokeStyle = s.fill
      ctx.lineWidth = 1.4
      ctx.stroke()
    } else {
      ctx.fillStyle = s.fill
      ctx.fill()
    }
  }
  switch (kind) {
    case 'petals':
      return (ctx) => {
        ctx.beginPath()
        around(ctx, s.n, () => {
          const w = len * s.wide
          ctx.moveTo(s.r0, 0)
          ctx.quadraticCurveTo(mid, -w, s.r1, 0)
          ctx.quadraticCurveTo(mid, w, s.r0, 0)
        })
        paint(ctx)
      }
    case 'teardrops':
      return (ctx) => {
        ctx.beginPath()
        around(ctx, s.n, () => {
          const w = len * (s.wide + 0.1)
          ctx.moveTo(s.r0, 0)
          ctx.bezierCurveTo(s.r0 + len * 0.5, -w, s.r1 + w * 0.4, -w * 0.7, s.r1, 0)
          ctx.bezierCurveTo(s.r1 + w * 0.4, w * 0.7, s.r0 + len * 0.5, w, s.r0, 0)
        })
        paint(ctx)
      }
    case 'leaves':
      return (ctx) => {
        ctx.beginPath()
        around(ctx, s.n, () => {
          for (const side of [-1, 1]) {
            const a = side * (Math.PI / s.n) * 0.55
            const cx = Math.cos(a)
            const cy = Math.sin(a)
            const w = len * 0.22
            ctx.moveTo(s.r0 * cx, s.r0 * cy)
            ctx.quadraticCurveTo(mid * cx - w * cy, mid * cy + w * cx, s.r1 * cx, s.r1 * cy)
            ctx.quadraticCurveTo(mid * cx + w * cy, mid * cy - w * cx, s.r0 * cx, s.r0 * cy)
          }
        })
        paint(ctx)
      }
    case 'dots':
      return (ctx) => {
        ctx.fillStyle = s.fill
        ctx.beginPath()
        const size = Math.max(1.2, Math.min(len * 0.32, ((Math.PI * mid) / s.m) * 0.42))
        around(ctx, s.m, () => {
          ctx.moveTo(mid + size, 0)
          ctx.arc(mid, 0, size, 0, TAU)
        })
        ctx.fill()
      }
    case 'diamonds':
      return (ctx) => {
        ctx.beginPath()
        const w = Math.min(len * 0.3, ((Math.PI * mid) / s.m) * 0.5)
        around(ctx, s.m, () => {
          ctx.moveTo(s.r0, 0)
          ctx.lineTo(mid, -w)
          ctx.lineTo(s.r1, 0)
          ctx.lineTo(mid, w)
          ctx.closePath()
        })
        paint(ctx)
      }
    case 'scallops':
      return (ctx) => {
        // A ring of arcs bulging outward, like the edge of a lotus.
        const half = Math.PI / s.m
        const bump = mid * Math.sin(half)
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1.6
        ctx.beginPath()
        around(ctx, s.m, () => {
          const cx = mid * Math.cos(half)
          ctx.moveTo(cx + bump * Math.cos(-Math.PI / 2), bump * Math.sin(-Math.PI / 2))
          ctx.arc(cx, 0, bump, -Math.PI / 2, Math.PI / 2)
        })
        ctx.stroke()
      }
    case 'star':
      return (ctx) => {
        // A star of interlaced polygons: each point joined to the one k along. Where k shares a
        // factor with n the star is several polygons, as two squares make an eight-point star.
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1.3
        ctx.beginPath()
        const k = s.n === 6 ? 2 : s.n === 16 ? 6 : s.n >= 10 ? 4 : 2
        const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
        const loops = gcd(s.n, k)
        for (let l = 0; l < loops; l++)
          for (let i = 0; i <= s.n / loops; i++) {
            const a = s.turn + ((l + i * k) % s.n) * (TAU / s.n)
            const x = Math.cos(a) * s.r1
            const y = Math.sin(a) * s.r1
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
        ctx.stroke()
      }
    case 'spokes':
      return (ctx) => {
        // Rays from the inner ring to the outer, each tipped with a dot.
        ctx.strokeStyle = s.fill
        ctx.fillStyle = s.fill
        ctx.lineWidth = 1.1
        ctx.beginPath()
        around(ctx, s.m, () => {
          ctx.moveTo(s.r0, 0)
          ctx.lineTo(s.r1 - 1.5, 0)
        })
        ctx.stroke()
        ctx.beginPath()
        around(ctx, s.m, () => {
          ctx.moveTo(s.r1 + 1.4, 0)
          ctx.arc(s.r1, 0, 1.4, 0, TAU)
        })
        ctx.fill()
      }
    case 'zigzag':
      return (ctx) => {
        // A closed zigzag between the two radii, like a border of triangles.
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1.3
        ctx.beginPath()
        const pts = s.m * 2
        for (let i = 0; i <= pts; i++) {
          const a = s.turn + (i * TAU) / pts
          const r = i % 2 ? s.r1 : s.r0
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        ctx.stroke()
      }
    case 'veined':
      return (ctx) => {
        // Petals drawn in outline with a midrib, like a lotus in powder lines.
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1.2
        ctx.beginPath()
        around(ctx, s.n, () => {
          const w = len * (s.wide + 0.05)
          ctx.moveTo(s.r0, 0)
          ctx.quadraticCurveTo(mid, -w, s.r1, 0)
          ctx.quadraticCurveTo(mid, w, s.r0, 0)
          ctx.moveTo(s.r0 + len * 0.15, 0)
          ctx.lineTo(s.r1 - len * 0.2, 0)
        })
        ctx.stroke()
      }
    case 'squares':
      return (ctx) => {
        // Two or three squares, each turned a little further: the ashtadal frame.
        const k = s.n % 3 === 0 ? 3 : 2
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (let j = 0; j < k; j++)
          for (let i = 0; i <= 4; i++) {
            const a = s.turn + (j * Math.PI) / (2 * k) + (i * TAU) / 4 + Math.PI / 4
            if (i === 0) ctx.moveTo(Math.cos(a) * s.r1, Math.sin(a) * s.r1)
            else ctx.lineTo(Math.cos(a) * s.r1, Math.sin(a) * s.r1)
          }
        ctx.stroke()
      }
    case 'arcs':
      return (ctx) => {
        // Kolam loops: a line curling around each dot of a ring.
        const r = Math.min(len * 0.45, ((Math.PI * mid) / s.m) * 0.55)
        ctx.strokeStyle = s.fill
        ctx.fillStyle = s.fill
        ctx.lineWidth = 1.2
        ctx.beginPath()
        around(ctx, s.m, () => {
          ctx.moveTo(mid + r * Math.cos(-2.4), r * Math.sin(-2.4))
          ctx.arc(mid, 0, r, -2.4, 2.4)
        })
        ctx.stroke()
        ctx.beginPath()
        around(ctx, s.m, () => {
          ctx.moveTo(mid + 1.3, 0)
          ctx.arc(mid, 0, 1.3, 0, TAU)
        })
        ctx.fill()
      }
    case 'crescents':
      return (ctx) => {
        // Small moons facing outward.
        const r = Math.min(len * 0.38, ((Math.PI * mid) / s.m) * 0.45)
        ctx.fillStyle = s.fill
        ctx.beginPath()
        around(ctx, s.m, () => {
          ctx.moveTo(mid + r, 0)
          ctx.arc(mid, 0, r, 0, TAU)
          ctx.moveTo(mid - r * 0.35 + r * 0.8, 0)
          ctx.arc(mid - r * 0.35, 0, r * 0.8, 0, TAU, true)
        })
        ctx.fill('evenodd')
      }
    default:
      return (ctx) => {
        ctx.strokeStyle = s.fill
        ctx.lineWidth = 1
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.arc(0, 0, mid, 0, TAU)
        ctx.stroke()
        ctx.setLineDash([])
      }
  }
}

/**
 * One design of outer radius R: a centre dot, then `count` rings outward, in two or three of the
 * given inks. One solid ring of petals or teardrops gives every design a body.
 */
export function design(rand: () => number, inksFrom: readonly string[], R: number, count: number): Ring[] {
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!
  const shuffle = <T,>(xs: readonly T[]): T[] => xs.map((x) => [rand(), x] as const).sort((a, b) => a[0] - b[0]).map((p) => p[1])
  const n = pick([5, 6, 8, 8, 10, 12, 12, 16])
  const inks = shuffle(inksFrom).slice(0, R < 30 ? 2 : 3)
  const body = pick(['petals', 'teardrops'] as const)
  const rest = shuffle(KINDS.filter((k) => k !== body))
  const kinds = [...rest.slice(0, 1), body, ...rest.slice(1)]
  const centre = pick(inks)
  const c0 = R * (0.08 + rand() * 0.06)
  const rings: Ring[] = [
    (ctx) => {
      ctx.fillStyle = centre
      ctx.beginPath()
      ctx.arc(0, 0, c0, 0, TAU)
      ctx.fill()
    },
  ]
  let r = c0 * 1.3
  for (let i = 0; i < count; i++) {
    const band = ((R - c0) / count) * (0.8 + rand() * 0.5)
    const r1 = Math.min(R, r + band)
    const kind = kinds[i % kinds.length]!
    rings.push(ring(kind, { n, m: rand() < 0.4 ? n * 2 : n, r0: r, r1, fill: pick(inks), turn: rand() < 0.5 ? 0 : Math.PI / n, wide: 0.28 + rand() * 0.3, stroke: kind !== body && rand() < 0.35 }))
    r = r1 + 1.5
  }
  return rings
}
