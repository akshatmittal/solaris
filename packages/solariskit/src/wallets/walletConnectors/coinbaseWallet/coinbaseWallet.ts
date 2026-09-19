import { type CreateConnectorFn, createConnector } from "wagmi";
import { type CoinbaseWalletParameters, coinbaseWallet as coinbaseWalletConnector } from "wagmi/connectors";

import type { Wallet, WalletDetailsParams } from "../../Wallet";

export interface CoinbaseWalletOptions {
  appName: string;
  appIcon?: string;
}

type AcceptedCoinbaseWalletParameters = Omit<CoinbaseWalletParameters, "appName" | "appLogoUrl">;

interface CoinbaseWallet extends AcceptedCoinbaseWalletParameters {
  (params: CoinbaseWalletOptions): Wallet;
}

export const coinbaseWallet: CoinbaseWallet = ({ appName, appIcon }: CoinbaseWalletOptions): Wallet => {
  // Extract all AcceptedCoinbaseWalletParameters from coinbaseWallet
  // This approach avoids type errors for properties not yet in upstream connector
  const { preference, ...optionalConfig } = coinbaseWallet;

  return {
    id: "coinbase",
    aliases: ["coinbaseWallet"],
    name: "Coinbase Wallet",
    shortName: "Coinbase",
    rdns: "com.coinbase.wallet",
    iconUrl: async () => (await import("./coinbaseWallet.svg")).default,
    iconAccent: "#2C5FF6",
    iconBackground: "#2C5FF6",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const connector: CreateConnectorFn = coinbaseWalletConnector({
        appName,
        appLogoUrl: appIcon,
        ...optionalConfig,
        preference: {
          options: "all",
          telemetry: false,
          ...preference,
        },
      });

      return createConnector((config) => ({
        ...connector(config),
        ...walletDetails,
      }));
    },
  };
};
