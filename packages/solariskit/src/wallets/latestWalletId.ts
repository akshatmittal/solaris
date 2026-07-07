import { walletIdStorage } from "./recentWalletIds";

export function getLatestWalletId(): string {
  return walletIdStorage.getLatest();
}

export function addLatestWalletId(walletId: string): void {
  walletIdStorage.addLatest(walletId);
}

export function clearLatestWalletId(): void {
  walletIdStorage.clearLatest();
}
