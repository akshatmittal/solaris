import { createWalletIdStorage } from "./walletIdStorage";

export const walletIdStorage = createWalletIdStorage({ latest: "rk-latest-id", recent: "rk-recent" });

export function getRecentWalletIds(): string[] {
  return walletIdStorage.getRecent();
}

export function addRecentWalletId(walletId: string): void {
  walletIdStorage.addRecent(walletId);
}
