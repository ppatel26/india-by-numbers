/** Chart tabs (Chart, Table, Map) and the hover tooltip for anything with data-tip. */

function select(frame: Element, view: string, focus = false): void {
  const tabs = frame.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  if (![...tabs].some((t) => t.dataset.view === view)) return
  for (const tab of tabs) {
    const on = tab.dataset.view === view
    tab.setAttribute('aria-selected', String(on))
    tab.tabIndex = on ? 0 : -1
    const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '')
    if (panel) panel.hidden = !on
    if (on && focus) tab.focus()
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as Element
  const tab = target.closest<HTMLButtonElement>('[role="tab"][data-view]')
  const link = target.closest<HTMLAnchorElement>('[data-view-link]')
  const frame = (tab ?? link)?.closest('[data-chart]')
  if (!frame) return
  if (link) e.preventDefault()
  select(frame, (tab?.dataset.view ?? link?.dataset.viewLink)!)
})

document.addEventListener('keydown', (e) => {
  const tab = (e.target as Element).closest?.<HTMLButtonElement>('[role="tab"][data-view]')
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
  const tabs = [...tab.parentElement!.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  const i = tabs.indexOf(tab)
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  e.preventDefault()
  select(tab.closest('[data-chart]')!, tabs[next]!.dataset.view!, true)
})

// ?tab=table opens that view on a chart page.
const tab = new URLSearchParams(location.search).get('tab')
if (tab) document.querySelectorAll('[data-chart]').forEach((f) => select(f, tab))

const tip = document.querySelector<HTMLElement>('.tip')

function show(el: Element, x: number, y: number): void {
  if (!tip) return
  const [head, ...rest] = (el.getAttribute('data-tip') ?? '').split('\n')
  tip.replaceChildren()
  const strong = document.createElement('strong')
  strong.textContent = head ?? ''
  tip.append(strong, rest.join('\n'))
  tip.hidden = false
  const w = tip.offsetWidth
  const h = tip.offsetHeight
  tip.style.left = `${Math.min(x + 14, innerWidth - w - 8)}px`
  tip.style.top = `${y + h + 20 > innerHeight ? y - h - 14 : y + 14}px`
}

document.addEventListener('pointermove', (e) => {
  const el = (e.target as Element).closest?.('[data-tip]')
  if (el) show(el, e.clientX, e.clientY)
  else if (tip) tip.hidden = true
})

document.addEventListener('focusin', (e) => {
  const el = (e.target as Element).closest?.('[data-tip]')
  if (!el) return
  const r = el.getBoundingClientRect()
  show(el, r.right, r.top)
})

document.addEventListener('focusout', () => {
  if (tip) tip.hidden = true
})
