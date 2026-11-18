/**
 * The selected state. Charts mark it with .is-sel on every [data-geo] that
 * matches; <select data-state-select> sets it. A state page selects its own
 * state (data-page-state on <main>) without changing the saved choice; the
 * home page shows data-default-state until the reader picks one.
 */
import { load, save } from './store'

const KEY = 'ibn:state'

function apply(slug: string): void {
  document.querySelectorAll('.is-sel').forEach((el) => el.classList.remove('is-sel'))
  if (slug) document.querySelectorAll(`[data-geo="${CSS.escape(slug)}"]`).forEach((el) => el.classList.add('is-sel'))
  document.querySelectorAll<HTMLSelectElement>('[data-state-select]').forEach((s) => (s.value = slug))
  const name = document.querySelector<HTMLSelectElement>('[data-state-select]')?.selectedOptions[0]?.textContent ?? ''
  document.querySelectorAll<HTMLElement>('[data-state-name]').forEach((el) => (el.textContent = slug ? name : ''))
  document.querySelectorAll<HTMLElement>('[data-state-only]').forEach((el) => (el.hidden = !slug))
  document.querySelectorAll<HTMLAnchorElement>('[data-state-link]').forEach((a) => (a.href = `/states/${slug}/`))
}

document.addEventListener('change', (e) => {
  const nav = (e.target as Element).closest<HTMLSelectElement>('[data-state-nav]')
  if (nav) location.href = `/states/${nav.value}/`
  const s = (e.target as Element).closest<HTMLSelectElement>('[data-state-select]')
  if (!s) return
  apply(s.value)
  save(KEY, s.value)
})

const main = document.querySelector<HTMLElement>('main')?.dataset
apply(main?.pageState ?? load(KEY) ?? main?.defaultState ?? '')
