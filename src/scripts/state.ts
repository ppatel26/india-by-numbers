/**
 * The selected state. Charts mark it with .is-sel on every [data-geo] that
 * matches; the state picker (src/scripts/picker.ts) sets it through choose().
 * A state page selects its own state (data-page-state on <main>) without
 * changing the saved choice; the home page shows data-default-state until the
 * reader picks one.
 */
import { load, save } from './store'

const KEY = 'ibn:state'

/** Show the choice on a picker's button and in its list. */
function mark(pick: HTMLElement, slug: string): string {
  const chosen = slug ? pick.querySelector<HTMLElement>(`[data-value="${CSS.escape(slug)}"]`) : null
  pick.querySelectorAll('[role="option"]').forEach((o) => o.setAttribute('aria-selected', String(o === chosen)))
  const name = chosen?.querySelector('.n')?.textContent ?? ''
  pick.querySelector('[data-pick-name]')!.textContent = name || (pick.dataset.placeholder ?? '')
  const code = pick.querySelector<HTMLElement>('[data-pick-code]')!
  code.textContent = chosen?.dataset.code ?? ''
  code.hidden = !chosen
  const clear = pick.querySelector<HTMLElement>('[data-pick-clear]')
  if (clear) clear.hidden = !chosen
  return name
}

function apply(slug: string): void {
  document.querySelectorAll('.is-sel').forEach((el) => el.classList.remove('is-sel'))
  if (slug) document.querySelectorAll(`[data-geo="${CSS.escape(slug)}"]`).forEach((el) => el.classList.add('is-sel'))
  let name = ''
  document.querySelectorAll<HTMLElement>('[data-pick="select"]').forEach((p) => (name = mark(p, slug)))
  document.querySelectorAll<HTMLElement>('[data-state-name]').forEach((el) => (el.textContent = name))
  document.querySelectorAll<HTMLElement>('[data-state-only]').forEach((el) => (el.hidden = !slug))
  document.querySelectorAll<HTMLAnchorElement>('[data-state-link]').forEach((a) => (a.href = `/states/${slug}/`))
}

/** Mark a state on this page and remember it for the next one. An empty slug clears it. */
export function choose(slug: string): void {
  apply(slug)
  save(KEY, slug)
}

const main = document.querySelector<HTMLElement>('main')?.dataset
apply(main?.pageState ?? load(KEY) ?? main?.defaultState ?? '')
