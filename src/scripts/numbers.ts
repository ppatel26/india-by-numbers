/**
 * The number switch. Every element with data-alt holds the other form of its
 * number; switching swaps text and data-alt. Tooltips swap data-tip and
 * data-tip-alt the same way. The choice is kept per browser.
 */
import { load, save } from './store'

type Mode = 'indian' | 'intl'
const KEY = 'ibn:numbers'
let mode: Mode = 'intl'

function apply(next: Mode): void {
  if (next === mode) return
  mode = next
  document.querySelectorAll<Element>('[data-alt]').forEach((el) => {
    const alt = el.getAttribute('data-alt')!
    el.setAttribute('data-alt', el.textContent ?? '')
    el.textContent = alt
  })
  document.querySelectorAll<Element>('[data-tip-alt]').forEach((el) => {
    const alt = el.getAttribute('data-tip-alt')!
    el.setAttribute('data-tip-alt', el.getAttribute('data-tip') ?? '')
    el.setAttribute('data-tip', alt)
  })
  document.querySelectorAll<HTMLButtonElement>('[data-numbers]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.numbers === mode)))
  document.documentElement.dataset.numbers = mode
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-numbers]')
  if (!b) return
  const next = b.dataset.numbers as Mode
  apply(next)
  save(KEY, next)
})

if (load(KEY) === 'indian') apply('indian')
