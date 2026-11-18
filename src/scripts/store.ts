/** localStorage that never throws: private modes and blocked storage just forget the choice. */
export function load(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // The choice still applies to this page.
  }
}
