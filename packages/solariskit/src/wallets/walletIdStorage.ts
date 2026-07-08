function safeParseJsonArray<T>(string: string | null): T[] {
  try {
    const value = string ? JSON.parse(string) : [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function dedupe<T>(array: T[]): T[] {
  return [...new Set(array)];
}

function getLocalStorage(): Storage | undefined {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

export function getStorageItem(key: string): string | null {
  try {
    return getLocalStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function setStorageItem(key: string, value: string): void {
  try {
    getLocalStorage()?.setItem(key, value);
  } catch {}
}

export function removeStorageItem(key: string): void {
  try {
    getLocalStorage()?.removeItem(key);
  } catch {}
}

export interface WalletIdStorage {
  addLatest: (walletId: string) => void;
  addRecent: (walletId: string) => void;
  clearLatest: () => void;
  getLatest: () => string;
  getRecent: () => string[];
}

export function createWalletIdStorage(keys: { latest: string; recent: string }): WalletIdStorage {
  const getRecent = (): string[] => safeParseJsonArray(getStorageItem(keys.recent));

  return {
    addLatest: (walletId) => {
      setStorageItem(keys.latest, walletId);
    },
    addRecent: (walletId) => {
      const newValue = dedupe([walletId, ...getRecent()]);

      setStorageItem(keys.recent, JSON.stringify(newValue));
    },
    clearLatest: () => {
      removeStorageItem(keys.latest);
    },
    getLatest: () => getStorageItem(keys.latest) || "",
    getRecent,
  };
}
