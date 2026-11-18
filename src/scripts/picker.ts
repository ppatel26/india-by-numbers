/**
 * The state picker (src/components/StateSelect.astro): opens the list under its button,
 * filters it as the reader types, and moves through it with the arrow keys.
 * A picker on a state page goes to the chosen state's page; any other marks the state here.
 */
import { choose } from './state'

const sheet = matchMedia('(max-width: 560px)')
const touch = matchMedia('(pointer: coarse)')
const GAP = 6
const EDGE = 16

document.querySelectorAll<HTMLElement>('[data-pick]').forEach((pick, n) => {
  const trigger = pick.querySelector<HTMLButtonElement>('.trigger')!
  const panel = pick.querySelector<HTMLElement>('[data-pick-panel]')!
  const input = pick.querySelector<HTMLInputElement>('[data-pick-input]')!
  const list = pick.querySelector<HTMLElement>('[data-pick-list]')!
  const none = pick.querySelector<HTMLElement>('[data-pick-none]')!
  const options = [...pick.querySelectorAll<HTMLElement>('[role="option"]')]
  const groups = [...pick.querySelectorAll<HTMLElement>('[data-pick-group]')]
  const visible = () => options.filter((o) => !o.hidden)

  list.id = `pick-${n}`
  input.setAttribute('aria-controls', list.id)
  options.forEach((o) => (o.id = `pick-${n}-${o.dataset.value}`))
  trigger.popoverTargetElement = panel

  let active: HTMLElement | undefined
  const activate = (o: HTMLElement | undefined, scroll = true) => {
    active?.removeAttribute('data-active')
    active = o
    if (!o) return input.removeAttribute('aria-activedescendant')
    o.setAttribute('data-active', '')
    input.setAttribute('aria-activedescendant', o.id)
    if (scroll) o.scrollIntoView({ block: 'nearest' })
  }

  const filter = () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    for (const o of options) o.hidden = !words.every((w) => o.dataset.terms!.includes(w))
    for (const g of groups) g.hidden = !g.querySelector('[role="option"]:not([hidden])')
    const shown = visible()
    none.hidden = shown.length > 0
    activate(shown[0])
  }

  const place = () => {
    panel.style.cssText = ''
    if (sheet.matches) return
    const r = trigger.getBoundingClientRect()
    const width = Math.min(600, innerWidth - 2 * EDGE)
    const below = innerHeight - r.bottom - GAP - EDGE
    const above = r.top - GAP - EDGE
    const up = below < 320 && above > below
    Object.assign(panel.style, {
      width: `${width}px`,
      // Line up with the button's left edge, or its right edge when the list would run off screen.
      left: `${Math.max(EDGE, r.left + width > innerWidth - EDGE ? r.right - width : r.left)}px`,
      maxHeight: `${Math.min(640, up ? above : below)}px`,
      ...(up ? { bottom: `${innerHeight - r.top + GAP}px` } : { top: `${r.bottom + GAP}px` }),
    })
  }

  const pickValue = (o: HTMLElement) => {
    const slug = o.dataset.value!
    if (pick.dataset.pick === 'nav') location.href = `/states/${slug}/`
    else choose(slug)
    panel.hidePopover()
  }

  panel.addEventListener('toggle', (e) => {
    const open = (e as ToggleEvent).newState === 'open'
    const follow = open ? addEventListener : removeEventListener
    follow('resize', place)
    follow('scroll', place, { passive: true, capture: true })
    if (!open) return
    input.value = ''
    filter()
    place()
    activate(options.find((o) => o.getAttribute('aria-selected') === 'true') ?? options[0])
    if (!touch.matches) input.focus()
  })

  input.addEventListener('input', filter)
  panel.addEventListener('keydown', (e) => {
    const shown = visible()
    const i = active ? shown.indexOf(active) : -1
    if (e.key === 'ArrowDown') activate(shown[Math.min(i + 1, shown.length - 1)])
    else if (e.key === 'ArrowUp') activate(shown[Math.max(i - 1, 0)])
    else if (e.key === 'Enter' && active && document.activeElement === input) pickValue(active)
    else return
    e.preventDefault()
  })
  list.addEventListener('pointermove', (e) => {
    const o = (e.target as Element).closest<HTMLElement>('[role="option"]')
    if (o && o !== active) activate(o, false)
  })
  list.addEventListener('click', (e) => {
    const o = (e.target as Element).closest<HTMLElement>('[role="option"]')
    if (o) pickValue(o)
  })
  pick.querySelector('[data-pick-clear]')?.addEventListener('click', () => {
    choose('')
    panel.hidePopover()
  })
})
