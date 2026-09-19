import { type CreateConnectorFn, createConnector } from "wagmi";
import { type BaseAccountParameters, baseAccount as baseAccountConnector } from "wagmi/connectors";

import type { Wallet, WalletDetailsParams } from "../../Wallet";

export interface CoinbaseWalletOptions {
  appName: string;
  appIcon?: string;
}

// supports preference, paymasterUrls, subAccounts
type AcceptedCoinbaseWalletParameters = Omit<BaseAccountParameters, "appName" | "appLogoUrl">;

interface CoinbaseWallet extends AcceptedCoinbaseWalletParameters {
  (params: CoinbaseWalletOptions): Wallet;
}

export const coinbaseWallet: CoinbaseWallet = ({ appName, appIcon }: CoinbaseWalletOptions): Wallet => {
  // Extract all AcceptedCoinbaseWalletParameters from coinbaseWallet
  // This approach avoids type errors for properties not yet in upstream connector
  const { preference, ...optionalConfig } = coinbaseWallet;

  return {
    id: "base",
    aliases: ["baseAccount", "coinbase", "coinbaseWallet"],
    name: "Coinbase Wallet",
    shortName: "Coinbase",
    rdns: "app.base.account",
    iconUrl: async () => (await import("./base.svg")).default,
    iconAccent: "#2C5FF6",
    iconBackground: "#2C5FF6",
    // a popup will appear prompting the user to connect or create a wallet via passkey.
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) => {
      const connector: CreateConnectorFn = baseAccountConnector({
        appName,
        appLogoUrl: appIcon,
        ...optionalConfig,
        preference: {
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

/**
 * @deprecated Use `CoinbaseWalletOptions` instead.
 */
export type BaseOptions = CoinbaseWalletOptions;

/**
 * @deprecated Use `coinbaseWallet` instead. This alias will be removed in a future version.
 */
export const base = coinbaseWallet;

/**
 * @deprecated Use `coinbaseWallet` instead. This alias will be removed in a future version.
 */
export const baseAccount = coinbaseWallet;
