import type React from "react";

import type {
  Rpc,
  RpcSubscriptions,
  SolanaRpcApi,
  SolanaRpcSubscriptionsApi,
  TransactionModifyingSigner,
} from "@solana/kit";

import type { ChainStatus } from "../components/ChainSelectButton/ChainSelectButton";
import type { AccountStatus } from "../components/ConnectButton/ConnectButtonView";
import type { DisclaimerComponent } from "../components/RainbowKitProvider/AppContext";
import type { AvatarComponent } from "../components/RainbowKitProvider/AvatarContext";
import type { ModalSizes } from "../components/RainbowKitProvider/ModalSizeContext";
import type { Theme } from "../components/RainbowKitProvider/RainbowKitProvider";
import type { ResponsiveValue } from "../css/sprinkles.css";

export type SolanaClusterId = `solana:${string}`;

export type SolanaNetwork = "mainnet" | "mainnet-beta" | "devnet" | "testnet" | "localnet";

export type SolanaClusterType = SolanaNetwork | "custom";

export interface SolanaCluster {
  id: SolanaClusterId;
  label: string;
  url: string;
  urlWs?: string;
}

export interface SolanaStorageAdapter<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe?: (callback: (value: T) => void) => () => void;
}

export interface SolanaWalletDisplayConfig {
  allowList?: string[];
  denyList?: string[];
  featured?: string[];
}

export interface SolanaWalletConnector {
  chains: readonly string[];
  features: readonly string[];
  icon: string;
  id: string;
  name: string;
  ready: boolean;
}

export interface SolanaConnectOptions {
  allowInteractiveFallback?: boolean;
  preferredAccount?: string;
  silent?: boolean;
}

export interface SolanaCoinGeckoConfig {
  apiKey?: string;
  baseDelay?: number;
  isPro?: boolean;
  maxRetries?: number;
  maxTimeout?: number;
}

export interface SolanaConnectorConfig {
  additionalWallets?: unknown[];
  autoConnect?: boolean;
  cluster?: {
    clusters?: SolanaCluster[];
    initialCluster?: SolanaClusterId;
    persistSelection?: boolean;
  };
  coingecko?: SolanaCoinGeckoConfig;
  debug?: boolean;
  imageProxy?: string;
  programLabels?: Record<string, string>;
  storage?: {
    account: SolanaStorageAdapter<string | undefined>;
    cluster: SolanaStorageAdapter<SolanaClusterId>;
    wallet: SolanaStorageAdapter<string | undefined>;
  };
  walletConnect?: never;
  wallets?: SolanaWalletDisplayConfig;
}

export interface SolanaMobileWalletAdapterConfig {
  appIdentity: {
    icon?: string;
    name: string;
    uri?: string;
  };
  authorizationCache?: unknown;
  chains?: readonly string[];
  chainSelector?: unknown;
  onWalletNotFound?: (wallet: unknown) => Promise<void>;
  remoteHostAuthority?: string;
}

export interface SolanaClient {
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
}

export interface SolanaDisconnectWalletReturn {
  disconnect: () => Promise<void>;
  isDisconnecting: boolean;
}

export interface SolanaClusterReturn {
  cluster: SolanaCluster | null;
  clusters: SolanaCluster[];
  explorerUrl: string;
  isDevnet: boolean;
  isLocal: boolean;
  isMainnet: boolean;
  isTestnet: boolean;
  setCluster: (id: SolanaClusterId) => Promise<void>;
  type: SolanaClusterType | null;
}

export interface SolanaTokenBalance {
  amount?: bigint | string | number;
  decimals?: number;
  formatted?: string;
  mint?: string;
  name?: string;
  symbol?: string;
  uiAmount?: number | null;
}

export interface SolanaBalanceOptions {
  autoRefresh?: boolean;
  cacheTimeMs?: number;
  client?: SolanaClient | null;
  enabled?: boolean;
  refetchOnMount?: boolean | "stale";
  refreshInterval?: number;
  staleTimeMs?: number;
}

export interface SolanaBalanceReturn {
  abort: () => void;
  error: Error | null;
  formattedSol: string;
  isLoading: boolean;
  lamports: bigint;
  lastUpdated: Date | null;
  refetch: (options?: { signal?: AbortSignal }) => Promise<void>;
  solBalance: number;
  tokens: SolanaTokenBalance[];
}

export interface SolanaClientReturn {
  client: SolanaClient | null;
  clusterType: SolanaClusterType | null;
  ready: boolean;
}

export interface SolanaKitTransactionSignerReturn {
  ready: boolean;
  signer: TransactionModifyingSigner | null;
}

export interface SolanaKitConfig extends SolanaConnectorConfig {
  appName?: string;
  appUrl?: string;
  enableMobile?: boolean;
  errorBoundary?: {
    enabled?: boolean;
    fallback?: (error: Error, retry: () => void) => React.ReactNode;
    maxRetries?: number;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  };
  mobile?: SolanaMobileWalletAdapterConfig;
  network?: SolanaNetwork;
}

export interface SolanaKitProviderProps {
  appInfo?: {
    appName?: string;
    learnMoreUrl?: string;
    disclaimer?: DisclaimerComponent;
  };
  avatar?: AvatarComponent;
  children: React.ReactNode;
  config?: SolanaKitConfig;
  id?: string;
  modalSize?: ModalSizes;
  theme?: Theme | null;
}

export interface SolanaConnectButtonProps {
  accountStatus?: ResponsiveValue<AccountStatus>;
  label?: string;
  showBalance?: ResponsiveValue<boolean>;
}

export type SolanaChainStatus = ChainStatus;

export interface SolanaChainSelectButtonProps {
  chainStatus?: ResponsiveValue<SolanaChainStatus>;
}

export interface SolanaWalletButtonProps {
  connectorId?: string;
}
