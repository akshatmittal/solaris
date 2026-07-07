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

  return {
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
  };
}

export function useSolanaWalletConnectors(): SolanaWalletConnector[] {
  return useWalletConnectors().map((connector) => ({
    chains: connector.chains,
    features: connector.features,
    icon: connector.icon,
    id: String(connector.id),
    name: connector.name,
    ready: connector.ready,
  }));
}

export function useSolanaConnectWallet() {
  const { connect, error, isConnecting, resetError } = useConnectWallet();

  return {
    connect: (connectorId: string, options?: SolanaConnectOptions) =>
      connect(connectorId as Parameters<typeof connect>[0], options as Parameters<typeof connect>[1]),
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
  const cluster = useCluster();

  return {
    cluster: cluster.cluster,
    clusters: cluster.clusters,
    explorerUrl: cluster.explorerUrl,
    isDevnet: cluster.isDevnet,
    isLocal: cluster.isLocal,
    isMainnet: cluster.isMainnet,
    isTestnet: cluster.isTestnet,
    setCluster: (id) => cluster.setCluster(id as Parameters<typeof cluster.setCluster>[0]),
    type: cluster.type,
  };
}

export function useSolanaBalance(options?: SolanaBalanceOptions): SolanaBalanceReturn {
  return useBalance(options as Parameters<typeof useBalance>[0]) as unknown as SolanaBalanceReturn;
}

export function useSolanaClient(): SolanaClientReturn {
  return useConnectorSolanaClient() as SolanaClientReturn;
}

export function useSolanaKitTransactionSigner(): SolanaKitTransactionSignerReturn {
  return useKitTransactionSigner() as SolanaKitTransactionSignerReturn;
}
