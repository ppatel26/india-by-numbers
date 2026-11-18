/**
 * The number switch. Every element with data-alt holds the other form of its
 * number; switching swaps text and data-alt. The choice is kept per browser.
 */
type Mode = 'indian' | 'intl'
const KEY = 'ibn:numbers'
let mode: Mode = 'indian'

function apply(next: Mode): void {
  if (next === mode) return
  mode = next
  document.querySelectorAll<Element>('[data-alt]').forEach((el) => {
    const alt = el.getAttribute('data-alt')!
    el.setAttribute('data-alt', el.textContent ?? '')
    el.textContent = alt
  })
  document.querySelectorAll<HTMLButtonElement>('[data-numbers]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.numbers === mode)))
  document.documentElement.dataset.numbers = mode
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-numbers]')
  if (!b) return
  const next = b.dataset.numbers as Mode
  localStorage.setItem(KEY, next)
  apply(next)
})

if (localStorage.getItem(KEY) === 'intl') apply('intl')
export {}
