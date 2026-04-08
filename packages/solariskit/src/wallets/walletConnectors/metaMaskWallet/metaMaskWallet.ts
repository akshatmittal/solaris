import type { DefaultWalletOptions, Wallet } from "../../Wallet";

import { getWalletConnectConnector } from "../../getWalletConnectConnector";

export type MetaMaskWalletOptions = DefaultWalletOptions;

export const metaMaskWallet = ({ projectId, walletConnectParameters }: MetaMaskWalletOptions): Wallet => ({
  id: "metaMask",
  name: "MetaMask Mobile",
  shortName: "MetaMask",
  rdns: "io.metamask.mobile",
  iconUrl: async () => (await import("./metaMaskWallet.svg")).default,
  iconAccent: "#f6851a",
  iconBackground: "#fff",
  mobile: {
    getUri: (uri: string) => `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
  },
  qrCode: {
    getUri: (uri: string) => `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
  },
  createConnector: getWalletConnectConnector({
    projectId,
    walletConnectParameters,
  }),
});
