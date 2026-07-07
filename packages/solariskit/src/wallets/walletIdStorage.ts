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

export interface WalletIdStorage {
  addLatest: (walletId: string) => void;
  addRecent: (walletId: string) => void;
  clearLatest: () => void;
  getLatest: () => string;
  getRecent: () => string[];
}

export function createWalletIdStorage(keys: { latest: string; recent: string }): WalletIdStorage {
  const getRecent = (): string[] =>
    typeof window !== "undefined" ? safeParseJsonArray(window.localStorage.getItem(keys.recent)) : [];

  return {
    addLatest: (walletId) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(keys.latest, walletId);
      }
    },
    addRecent: (walletId) => {
      const newValue = dedupe([walletId, ...getRecent()]);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(keys.recent, JSON.stringify(newValue));
      }
    },
    clearLatest: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(keys.latest);
      }
    },
    getLatest: () => (typeof window !== "undefined" ? window.localStorage.getItem(keys.latest) || "" : ""),
    getRecent,
  };
}
