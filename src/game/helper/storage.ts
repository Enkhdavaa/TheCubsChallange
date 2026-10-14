// Small conveniences kept in this browser only. Storage can be blocked or
// cleared, so every access is allowed to fail
export function readItem(key: string): string | null {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string) {
  try {
    globalThis.localStorage.setItem(key, value);
  } catch {
    // Nothing to do; it just isn't remembered
  }
}
