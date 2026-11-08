import { createWalletIdStorage } from "../../wallets/walletIdStorage";

const storage = createWalletIdStorage({ latest: "rk-solana-latest-id", recent: "rk-solana-recent" });

export function getRecentSolanaWalletIds(): string[] {
  return storage.getRecent();
}

export function addRecentSolanaWalletId(walletId: string): void {
  storage.addRecent(walletId);
}
