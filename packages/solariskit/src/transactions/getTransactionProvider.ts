import type { PublicClient } from "viem";

const transactionWatcherKey = "rk-transactions";

export function getTransactionProvider(provider: PublicClient): PublicClient {
  const uid = `${provider.uid}.${transactionWatcherKey}`;

  return {
    ...provider,
    uid,
  } as PublicClient;
}
