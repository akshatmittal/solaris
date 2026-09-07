import type { Address, PublicClient, TransactionReceipt } from "viem";

import { waitForTransactionReceipt } from "viem/actions";

import { setStorageItem } from "../wallets/walletIdStorage";
import { getTransactionProvider } from "./getTransactionProvider";

const storageKey = "rk-transactions";

type TransactionStatus = "pending" | "confirmed" | "failed";

export interface Transaction {
  hash: string;
  description: string;
  status: TransactionStatus;
  confirmations?: number;
}

export type NewTransaction = Omit<Transaction, "status">;

type Data = Record<string, Record<number, Transaction[] | undefined>>;

function loadData(fallback: Data = {}): Data {
  try {
    if (typeof window === "undefined") return fallback;
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") as Data;
  } catch {
    return fallback;
  }
}

const transactionHashRegex = /^0x([A-Fa-f0-9]{64})$/;

function validateTransaction(transaction: Transaction | NewTransaction): string[] {
  const errors: string[] = [];

  if (!transactionHashRegex.test(transaction.hash)) {
    errors.push("Invalid transaction hash");
  }

  if (typeof transaction.description !== "string") {
    errors.push("Transaction must have a description");
  }

  if (
    typeof transaction.confirmations !== "undefined" &&
    (!Number.isInteger(transaction.confirmations) || transaction.confirmations < 1)
  ) {
    errors.push("Transaction confirmations must be a positiver integer");
  }

  return errors;
}

export function createTransactionStore({ provider: initialProvider }: { provider: PublicClient }) {
  let data: Data = loadData();
  let unsaved: Record<string, Record<number, { transactions: Transaction[]; cleared: boolean }>> = {};

  let transactionProvider: PublicClient;
  const listeners: Set<() => void> = new Set();
  const transactionListeners: Set<(txStatus: TransactionReceipt["status"]) => void> = new Set();
  const transactionRequestCache: Map<string, Promise<void>> = new Map();

  function setProvider(newProvider: PublicClient): void {
    transactionProvider = getTransactionProvider(newProvider);
  }

  setProvider(initialProvider);

  function getTransactions(account: string, chainId: number): Transaction[] {
    return data[account]?.[chainId] ?? [];
  }

  function addTransaction(account: string, chainId: number, transaction: NewTransaction): void {
    const errors = validateTransaction(transaction);

    if (errors.length > 0) {
      throw new Error(["Unable to add transaction", ...errors].join("\n"));
    }

    updateTransactions(account, chainId, (transactions) => {
      return [
        { ...transaction, status: "pending" },
        ...transactions.filter(({ hash }) => {
          // Omit any duplicate transactions
          return hash !== transaction.hash;
        }),
      ];
    });
  }

  function clearTransactions(account: string, chainId: number): void {
    updateTransactions(
      account,
      chainId,
      () => {
        return [];
      },
      true,
    );
  }

  function setTransactionStatus(account: string, chainId: number, hash: string, status: TransactionStatus): void {
    updateTransactions(account, chainId, (transactions) => {
      return transactions.map((transaction) => (transaction.hash === hash ? { ...transaction, status } : transaction));
    });
  }

  async function waitForPendingTransactions(account: string, chainId: number): Promise<void> {
    await Promise.all(
      getTransactions(account, chainId)
        .filter((transaction) => transaction.status === "pending")
        .map(async (transaction) => {
          const { confirmations, hash } = transaction;
          const existingRequest = transactionRequestCache.get(hash);

          if (existingRequest) {
            return await existingRequest;
          }

          const requestPromise = waitForTransactionReceipt(transactionProvider, {
            confirmations,
            hash: hash as Address,
            timeout: 300_000, // 5 minutes
          })
            .then(({ status }) => {
              transactionRequestCache.delete(hash);

              if (status === undefined) {
                return;
              }

              setTransactionStatus(
                account,
                chainId,
                hash,
                // @ts-expect-error - types changed with viem@1.1.0
                status === 0 || status === "reverted" ? "failed" : "confirmed",
              );

              notifyTransactionListeners(status);
            })
            .catch(() => {
              transactionRequestCache.delete(hash);
              // If a transaction is not found or cancelled
              // viem will throw a 'TransactionNotFoundError'.
              // In this case it should mark the transaction as 'failed'
              setTransactionStatus(account, chainId, hash, "failed");
            });

          transactionRequestCache.set(hash, requestPromise);

          return await requestPromise;
        }),
    );
  }

  function updateTransactions(
    account: string,
    chainId: number,
    updateFn: (transactions: Transaction[]) => Transaction[],
    clear = false,
  ): void {
    // Keep one retained snapshot per dirty account/chain, not a mutation history.
    // Local hashes win conflicts; a local clear replaces its entire chain.
    data = loadData(data);
    for (const [account, chains] of Object.entries(unsaved)) {
      data[account] ??= {};
      for (const [chain, pending] of Object.entries(chains)) {
        const chainId = Number(chain);
        const hashes = new Set(pending.transactions.map(({ hash }) => hash));
        data[account][chainId] = retainTransactions([
          ...pending.transactions,
          ...(pending.cleared ? [] : (data[account][chainId] ?? []).filter(({ hash }) => !hashes.has(hash))),
        ]);
      }
    }

    data[account] ??= {};
    const transactions = retainTransactions(updateFn(data[account][chainId] ?? []));
    data[account][chainId] = transactions.length > 0 ? transactions : undefined;
    unsaved[account] ??= {};
    unsaved[account][chainId] = { transactions, cleared: clear || !!unsaved[account][chainId]?.cleared };

    if (setStorageItem(storageKey, JSON.stringify(data))) unsaved = {};
    notifyListeners();
    waitForPendingTransactions(account, chainId);
  }

  function retainTransactions(transactions: Transaction[]): Transaction[] {
    let completedTransactionCount = 0;
    const MAX_COMPLETED_TRANSACTIONS = 10;
    return transactions.filter(({ status }) =>
      status === "pending" ? true : completedTransactionCount++ < MAX_COMPLETED_TRANSACTIONS,
    );
  }

  function notifyListeners(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  function notifyTransactionListeners(txStatus: TransactionReceipt["status"]): void {
    for (const transactionListener of transactionListeners) {
      transactionListener(txStatus);
    }
  }

  function onChange(fn: () => void): () => void {
    listeners.add(fn);

    return () => {
      listeners.delete(fn);
    };
  }

  function onTransactionStatus(fn: (txStatus: TransactionReceipt["status"]) => void): () => void {
    transactionListeners.add(fn);

    return () => {
      transactionListeners.delete(fn);
    };
  }

  return {
    addTransaction,
    clearTransactions,
    getTransactions,
    onTransactionStatus,
    onChange,
    setProvider,
    waitForPendingTransactions,
  };
}

export type TransactionStore = ReturnType<typeof createTransactionStore>;
