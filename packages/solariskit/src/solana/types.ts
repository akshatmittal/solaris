import type React from "react";

import type { ConnectorConfig, ExtendedConnectorConfig } from "@solana/connector";
import type { AppProviderProps } from "@solana/connector/react";

import type { ChainStatus } from "../components/ChainSelectButton/ChainSelectButton";
import type { AccountStatus } from "../components/ConnectButton/ConnectButtonView";
import type { DisclaimerComponent } from "../components/RainbowKitProvider/AppContext";
import type { AvatarComponent } from "../components/RainbowKitProvider/AvatarContext";
import type { ModalSizes } from "../components/RainbowKitProvider/ModalSizeContext";
import type { Theme } from "../components/RainbowKitProvider/RainbowKitProvider";
import type { ResponsiveValue } from "../css/sprinkles.css";

// The Solana-prefixed public names are aliases of the @solana/connector
// types, so the compiler verifies them against the library and they can
// never drift. Only the shapes this kit deliberately changes (plain-string
// connector ids, no WalletConnect) are declared locally.
export type { SolanaCluster, SolanaClusterId } from "@solana/connector";
export type {
  ClusterType as SolanaClusterType,
  CoinGeckoConfig as SolanaCoinGeckoConfig,
  ConnectOptions as SolanaConnectOptions,
  MobileWalletAdapterConfig as SolanaMobileWalletAdapterConfig,
  SolanaClient,
  StorageAdapter as SolanaStorageAdapter,
  WalletDisplayConfig as SolanaWalletDisplayConfig,
} from "@solana/connector";
export type {
  TokenBalance as SolanaTokenBalance,
  UseBalanceOptions as SolanaBalanceOptions,
  UseBalanceReturn as SolanaBalanceReturn,
  UseClusterReturn as SolanaClusterReturn,
  UseDisconnectWalletReturn as SolanaDisconnectWalletReturn,
  UseKitTransactionSignerReturn as SolanaKitTransactionSignerReturn,
  UseSolanaClientReturn as SolanaClientReturn,
} from "@solana/connector/react";

/**
 * Network names the config surface accepts (includes the legacy
 * "mainnet-beta" alias, unlike the library's normalized SolanaNetwork).
 */
export type SolanaNetwork = NonNullable<ExtendedConnectorConfig["network"]>;

/** ConnectorKit configuration, minus WalletConnect (unsupported here). */
export type SolanaConnectorConfig = Omit<ConnectorConfig, "walletConnect"> & {
  walletConnect?: never;
};

export type SolanaKitConfig = Omit<ExtendedConnectorConfig, "walletConnect"> & {
  mobile?: NonNullable<AppProviderProps["mobile"]>;
  walletConnect?: never;
};

/** Wallet Standard connector surfaced with plain-string ids. */
export interface SolanaWalletConnector {
  chains: readonly string[];
  features: readonly string[];
  icon: string;
  id: string;
  name: string;
  ready: boolean;
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
