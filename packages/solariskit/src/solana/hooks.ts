import { useMemo } from "react";

import {
  useBalance,
  useCluster,
  useConnectWallet,
  useDisconnectWallet,
  useKitTransactionSigner,
  useSolanaClient as useConnectorSolanaClient,
  useWallet,
  useWalletConnectors,
} from "@solana/connector/react";

import type {
  SolanaBalanceOptions,
  SolanaBalanceReturn,
  SolanaClientReturn,
  SolanaClusterReturn,
  SolanaConnectOptions,
  SolanaDisconnectWalletReturn,
  SolanaKitTransactionSignerReturn,
  SolanaWalletConnector,
} from "./types";

import { clearLatestSolanaWalletId, disableSolanaAutoReconnect } from "./wallets/recentSolanaWalletIds";

export interface SolanaWalletAccount {
  address: string;
  label?: string;
}

export interface SolanaWalletState {
  account: string | null;
  accounts: SolanaWalletAccount[];
  connectorId: string | null;
  error: Error | null;
  isConnected: boolean;
  isConnecting: boolean;
  isError: boolean;
  status: "disconnected" | "connecting" | "connected" | "error";
}

export function useSolanaWallet(): SolanaWalletState {
  const wallet = useWallet();

  return useMemo(
    () => ({
      account: wallet.account ? String(wallet.account) : null,
      accounts: wallet.accounts.map((account) => ({
        address: String(account.address),
        label: account.label,
      })),
      connectorId: wallet.connectorId ? String(wallet.connectorId) : null,
      error: wallet.error,
      isConnected: wallet.isConnected,
      isConnecting: wallet.isConnecting,
      isError: wallet.isError,
      status: wallet.status,
    }),
    [wallet],
  );
}

export function useSolanaWalletConnectors(): SolanaWalletConnector[] {
  const connectors = useWalletConnectors();

  return useMemo(
    () =>
      connectors.map((connector) => ({
        chains: connector.chains,
        features: connector.features,
        icon: connector.icon,
        id: String(connector.id),
        name: connector.name,
        ready: connector.ready,
      })),
    [connectors],
  );
}

export function useSolanaConnectWallet() {
  const { connect, error, isConnecting, resetError } = useConnectWallet();

  return {
    // The kit's public API takes plain-string connector ids; the cast bridges
    // to ConnectorKit's branded id type, which validates ids at runtime.
    connect: (connectorId: string, options?: SolanaConnectOptions) =>
      connect(connectorId as Parameters<typeof connect>[0], options),
    error,
    isConnecting,
    resetError,
  };
}

export function useSolanaDisconnectWallet(): SolanaDisconnectWalletReturn {
  const { disconnect, isDisconnecting } = useDisconnectWallet();

  return {
    disconnect: async () => {
      clearLatestSolanaWalletId();
      disableSolanaAutoReconnect();
      await disconnect();
    },
    isDisconnecting,
  };
}

export function useSolanaCluster(): SolanaClusterReturn {
  return useCluster();
}

export function useSolanaBalance(options?: SolanaBalanceOptions): SolanaBalanceReturn {
  return useBalance(options);
}

export function useSolanaClient(): SolanaClientReturn {
  return useConnectorSolanaClient();
}

export function useSolanaKitTransactionSigner(): SolanaKitTransactionSignerReturn {
  return useKitTransactionSigner();
}
