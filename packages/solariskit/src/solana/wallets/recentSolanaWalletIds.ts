const recentStorageKey = "rk-solana-recent";
const latestStorageKey = "rk-solana-latest-id";
const reconnectDisabledStorageKey = "rk-solana-reconnect-disabled";

function safeParseJsonArray<T>(value: string | null): T[] {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dedupe<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function getRecentSolanaWalletIds(): string[] {
  return typeof window !== "undefined" ? safeParseJsonArray(window.localStorage.getItem(recentStorageKey)) : [];
}

export function addRecentSolanaWalletId(walletId: string): void {
  const newValue = dedupe([walletId, ...getRecentSolanaWalletIds()]);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(recentStorageKey, JSON.stringify(newValue));
  }
}

export function getLatestSolanaWalletId(): string {
  return typeof window !== "undefined" ? window.localStorage.getItem(latestStorageKey) || "" : "";
}

export function getLastConnectedSolanaWalletId(): string {
  if (typeof window !== "undefined" && window.localStorage.getItem(reconnectDisabledStorageKey) === "true") {
    return "";
  }

  return getLatestSolanaWalletId() || getRecentSolanaWalletIds()[0] || "";
}

export function addLatestSolanaWalletId(walletId: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(reconnectDisabledStorageKey);
    window.localStorage.setItem(latestStorageKey, walletId);
  }
}

export function clearLatestSolanaWalletId(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(latestStorageKey);
  }
}

export function disableSolanaAutoReconnect(): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(reconnectDisabledStorageKey, "true");
  }
}
