/**
 * <input data-filter="selector">: hide items whose data-words (or text) lack any typed word.
 * Containers marked data-filter-group hide when all their items do; data-filter-count shows the number left.
 */
import { normalise } from '~/lib/search'

for (const input of document.querySelectorAll<HTMLInputElement>('input[data-filter]')) {
  const items = [...document.querySelectorAll<HTMLElement>(input.dataset.filter!)]
  const count = document.querySelector('[data-filter-count]')
  input.addEventListener('input', () => {
    const terms = normalise(input.value).split(/\s+/).filter(Boolean)
    for (const el of items) el.hidden = !terms.every((t) => normalise(el.dataset.words ?? el.textContent ?? '').includes(t))
    for (const g of document.querySelectorAll<HTMLElement>('[data-filter-group]')) g.hidden = !items.some((el) => !el.hidden && g.contains(el))
    if (count) count.textContent = count.textContent!.replace(/^\d+/, String(items.filter((el) => !el.hidden).length))
  })
}
