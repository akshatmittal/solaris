import {
  createWalletIdStorage,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../../wallets/walletIdStorage";

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
  if (getStorageItem(reconnectDisabledStorageKey) === "true") {
    return "";
  }

  return getLatestSolanaWalletId() || getRecentSolanaWalletIds()[0] || "";
}

export function addLatestSolanaWalletId(walletId: string): void {
  removeStorageItem(reconnectDisabledStorageKey);

  storage.addLatest(walletId);
}

export function clearLatestSolanaWalletId(): void {
  storage.clearLatest();
}

export function disableSolanaAutoReconnect(): void {
  setStorageItem(reconnectDisabledStorageKey, "true");
}
