import { createWalletIdStorage } from "../../wallets/walletIdStorage";

const reconnectDisabledStorageKey = "rk-solana-reconnect-disabled";

const storage = createWalletIdStorage({ latest: "rk-solana-latest-id", recent: "rk-solana-recent" });

export function getRecentSolanaWalletIds(): string[] {
  return storage.getRecent();
}

export function addRecentSolanaWalletId(walletId: string): void {
  storage.addRecent(walletId);
}

export function getLatestSolanaWalletId(): string {
  return storage.getLatest();
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
  }

  storage.addLatest(walletId);
}

export function clearLatestSolanaWalletId(): void {
  storage.clearLatest();
}

export function disableSolanaAutoReconnect(): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(reconnectDisabledStorageKey, "true");
  }
}
