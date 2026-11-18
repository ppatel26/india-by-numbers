/**
 * The selected state. Charts mark it with .is-sel on every [data-geo] that
 * matches; the state picker (src/scripts/picker.ts) sets it through choose().
 * A state page selects its own state (data-page-state on <main>) without
 * changing the saved choice; the home page shows data-default-state until the
 * reader picks one. Inside [data-peek], pointing at a state's tile shows that
 * state until the pointer leaves.
 */
import { load, save } from './store'

const KEY = 'ibn:state'
let chosen = ''

const nameOf = (slug: string): string =>
  (slug && document.querySelector(`[data-pick] [data-value="${CSS.escape(slug)}"] .n`)?.textContent) || ''

/** Show the choice on a picker's button and in its list. */
function mark(pick: HTMLElement, slug: string): void {
  const option = slug ? pick.querySelector<HTMLElement>(`[data-value="${CSS.escape(slug)}"]`) : null
  pick.querySelectorAll('[role="option"]').forEach((o) => o.setAttribute('aria-selected', String(o === option)))
  pick.querySelector('[data-pick-name]')!.textContent = nameOf(slug) || (pick.dataset.placeholder ?? '')
  const code = pick.querySelector<HTMLElement>('[data-pick-code]')!
  code.textContent = option?.dataset.code ?? ''
  code.hidden = !option
  const clear = pick.querySelector<HTMLElement>('[data-pick-clear]')
  if (clear) clear.hidden = !option
}

/** Mark a state across the page. A peek leaves the pickers and the saved choice alone. */
function apply(slug: string, peek = false): void {
  document.querySelectorAll('.is-sel').forEach((el) => el.classList.remove('is-sel'))
  if (slug) document.querySelectorAll(`[data-geo="${CSS.escape(slug)}"]`).forEach((el) => el.classList.add('is-sel'))
  if (!peek) {
    chosen = slug
    document.querySelectorAll<HTMLElement>('[data-pick="select"]').forEach((p) => mark(p, slug))
  }
  const name = nameOf(slug)
  document.querySelectorAll<HTMLElement>('[data-state-name]').forEach((el) => (el.textContent = name))
  document.querySelectorAll<HTMLElement>('[data-state-only]').forEach((el) => (el.hidden = !slug))
  document.querySelectorAll<HTMLAnchorElement>('[data-state-link]').forEach((a) => (a.href = `/states/${slug}/`))
}

/** Mark a state on this page and remember it for the next one. An empty slug clears it. */
export function choose(slug: string): void {
  apply(slug)
  save(KEY, slug)
}

for (const area of document.querySelectorAll<HTMLElement>('[data-peek]')) {
  const tile = (e: Event) => (e.target as Element).closest<HTMLElement>('a[data-geo]')?.dataset.geo
  const peek = (slug: string | undefined) => slug && apply(slug, true)
  area.addEventListener('pointerover', (e) => e.pointerType === 'mouse' && peek(tile(e)))
  area.addEventListener('focusin', (e) => peek(tile(e)))
  area.addEventListener('pointerleave', () => apply(chosen, true))
  area.addEventListener('focusout', (e) => area.contains(e.relatedTarget as Node) || apply(chosen, true))
}

const main = document.querySelector<HTMLElement>('main')?.dataset
apply(main?.pageState ?? load(KEY) ?? main?.defaultState ?? '')
