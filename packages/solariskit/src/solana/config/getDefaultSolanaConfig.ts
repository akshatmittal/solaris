import type React from "react";

import {
  getDefaultConfig as getConnectorDefaultConfig,
  getDefaultMobileConfig as getConnectorDefaultMobileConfig,
} from "@solana/connector/react";

import type { SolanaCluster, SolanaConnectorConfig, SolanaKitConfig, SolanaNetwork } from "../types";

export interface SolanaDefaultConfigOptions {
  additionalWallets?: unknown[];
  appName: string;
  appUrl?: string;
  autoConnect?: boolean;
  clusterStorageKey?: string;
  clusters?: SolanaCluster[];
  coingecko?: SolanaConnectorConfig["coingecko"];
  customClusters?: SolanaCluster[];
  debug?: boolean;
  enableErrorBoundary?: boolean;
  enableMobile?: boolean;
  imageProxy?: string;
  maxRetries?: number;
  network?: SolanaNetwork;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  persistClusterSelection?: boolean;
  programLabels?: Record<string, string>;
  storage?: SolanaConnectorConfig["storage"];
  walletConnect?: never;
  wallets?: SolanaConnectorConfig["wallets"];
}

export type SolanaDefaultConfig = SolanaKitConfig;

export type SolanaDefaultConnectorConfig = SolanaDefaultConfig;

function getDefaultMobileNetwork(network: SolanaNetwork | undefined): Exclude<SolanaNetwork, "localnet"> | undefined {
  return network === "localnet" ? undefined : network;
}

export function getDefaultSolanaConfig(options: SolanaDefaultConfigOptions): SolanaDefaultConfig {
  const { walletConnect: _walletConnect, ...connectorOptions } = options as SolanaDefaultConfigOptions & {
    walletConnect?: unknown;
  };
  const connectorConfig = getConnectorDefaultConfig(
    connectorOptions as Parameters<typeof getConnectorDefaultConfig>[0],
  ) as SolanaDefaultConfig;
  const mobileNetwork = getDefaultMobileNetwork(options.network);
  const mobile =
    options.enableMobile === false || !mobileNetwork
      ? undefined
      : getConnectorDefaultMobileConfig({
          appName: options.appName,
          appUrl: options.appUrl,
          network: mobileNetwork,
        });

  return mobile ? { ...connectorConfig, mobile } : connectorConfig;
}
