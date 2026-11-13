import type { CreateConnectorFn } from "wagmi";

import type { WalletList } from "./Wallet";

import { type ConnectorsForWalletsParameters, connectorsForWallets } from "./connectorsForWallets";
import { base } from "./walletConnectors/base/base";
import { injectedWallet } from "./walletConnectors/injectedWallet/injectedWallet";
import { walletConnectWallet } from "./walletConnectors/walletConnectWallet/walletConnectWallet";

export function getDefaultWallets(parameters: ConnectorsForWalletsParameters): {
  connectors: CreateConnectorFn[];
  wallets: WalletList;
};

export function getDefaultWallets(): { wallets: WalletList };

export function getDefaultWallets(parameters?: ConnectorsForWalletsParameters) {
  const wallets: WalletList = [
    {
      groupName: "Popular",
      wallets: [injectedWallet, walletConnectWallet, base],
    },
  ];

  if (parameters) {
    return {
      connectors: connectorsForWallets(wallets, parameters),
      wallets,
    };
  }

  return {
    wallets,
  };
}
