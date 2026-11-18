/** <input data-filter="selector">: hide matching items whose data-words lack the typed text. */
for (const input of document.querySelectorAll<HTMLInputElement>('input[data-filter]')) {
  const items = document.querySelectorAll<HTMLElement>(input.dataset.filter!)
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase()
    items.forEach((el) => (el.hidden = q !== '' && !(el.dataset.words ?? el.textContent ?? '').toLowerCase().includes(q)))
  })
}

export {}
