/**
 * The footer timetable (src/components/Footer.astro): when the board scrolls into view, each flap
 * riffles through a few characters and settles on its own, row by row. The page holds the real
 * dates throughout; only the drawing moves. Still for readers who ask for less motion.
 */
const GLYPHS = '0123456789ABCDEFGHIJKLMNOPRSTUVY'
const TICK = 55 // ms per flip

/** `glyph` is the character inside a flap; only it moves, the tile stays still. */
function riffle(glyph: HTMLElement, final: string, flips: number): void {
  let left = flips
  const step = () => {
    glyph.classList.remove('flip')
    void glyph.offsetWidth // restart the flip animation
    glyph.classList.add('flip')
    glyph.textContent = --left > 0 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]! : final
    if (left > 0) setTimeout(step, TICK)
  }
  step()
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        seen.unobserve(e.target)
        e.target.querySelectorAll('li').forEach((row, r) =>
          row.querySelectorAll<HTMLElement>('.f > span').forEach((glyph, i) => {
            const final = glyph.textContent ?? ''
            if (final.trim()) setTimeout(() => riffle(glyph, final, 6 + i), r * 220)
          }),
        )
      }
    },
    { threshold: 0.6 },
  )
  document.querySelectorAll('[data-flaps]').forEach((b) => seen.observe(b))
}
