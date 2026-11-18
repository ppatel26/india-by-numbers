/** Typeahead for every input[data-search], and the results list on /search/. */
import { match, type Entry } from '~/lib/search'

let index: Promise<Entry[]> | undefined
const load = () => (index ??= fetch('/search.json').then((r) => r.json() as Promise<Entry[]>))

function row(e: Entry): HTMLLIElement {
  const li = document.createElement('li')
  const a = document.createElement('a')
  a.href = e.href
  const kind = document.createElement('span')
  kind.className = 'label muted'
  kind.textContent = e.kind
  const title = document.createElement('span')
  title.className = 't'
  title.textContent = e.title
  const detail = document.createElement('span')
  detail.className = 'd muted'
  detail.textContent = e.detail
  a.append(kind, title, detail)
  li.append(a)
  return li
}

for (const input of document.querySelectorAll<HTMLInputElement>('input[data-search]')) {
  const list = document.createElement('ul')
  list.className = 'typeahead'
  list.hidden = true
  input.closest('form')?.append(list)
  input.addEventListener('focus', () => void load())
  input.addEventListener('input', async () => {
    const q = input.value
    const hits = match(await load(), q, 8)
    if (input.value !== q) return
    list.replaceChildren(...hits.map(row))
    list.hidden = hits.length === 0
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') list.hidden = true
    if (e.key === 'ArrowDown') list.querySelector('a')?.focus()
  })
  list.addEventListener('keydown', (e) => {
    const a = document.activeElement?.closest('li')
    if (e.key === 'ArrowDown') (a?.nextElementSibling?.querySelector('a') as HTMLElement | null)?.focus()
    if (e.key === 'ArrowUp') ((a?.previousElementSibling?.querySelector('a') as HTMLElement | null) ?? input).focus()
    if (e.key.startsWith('Arrow')) e.preventDefault()
  })
  document.addEventListener('click', (e) => {
    if (!input.closest('form')?.contains(e.target as Node)) list.hidden = true
  })
}

const results = document.querySelector<HTMLElement>('[data-search-results]')
if (results) {
  const q = new URLSearchParams(location.search).get('q') ?? ''
  const box = document.querySelector<HTMLInputElement>('#page-q')
  if (box) box.value = q
  void load().then((all) => {
    const hits = match(all, q)
    const count = document.querySelector('[data-search-count]')
    if (count) count.textContent = q ? `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”` : ''
    results.replaceChildren(...hits.map(row))
    document.querySelector<HTMLElement>('[data-search-empty]')!.hidden = !q || hits.length > 0
  })
}
