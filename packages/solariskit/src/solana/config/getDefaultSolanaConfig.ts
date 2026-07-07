import type { DefaultConfigOptions } from "@solana/connector";

import {
  getDefaultConfig as getConnectorDefaultConfig,
  getDefaultMobileConfig as getConnectorDefaultMobileConfig,
} from "@solana/connector/react";

import type { SolanaKitConfig, SolanaNetwork } from "../types";

/** ConnectorKit's default-config options, minus WalletConnect (unsupported here). */
export type SolanaDefaultConfigOptions = Omit<DefaultConfigOptions, "walletConnect"> & {
  walletConnect?: never;
};

export type SolanaDefaultConfig = SolanaKitConfig;

export type SolanaDefaultConnectorConfig = SolanaDefaultConfig;

function getDefaultMobileNetwork(network: SolanaNetwork | undefined): Exclude<SolanaNetwork, "localnet"> | undefined {
  return network === "localnet" ? undefined : network;
}

export function getDefaultSolanaConfig(options: SolanaDefaultConfigOptions): SolanaDefaultConfig {
  const { walletConnect: _walletConnect, ...connectorOptions } = options;
  const { walletConnect: _connectorWalletConnect, ...connectorConfig } = getConnectorDefaultConfig(connectorOptions);
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
