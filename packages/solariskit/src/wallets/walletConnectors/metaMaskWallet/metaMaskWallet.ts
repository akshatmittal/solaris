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
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=io.metamask",
    ios: "https://apps.apple.com/us/app/metamask/id1438144202",
    mobile: "https://metamask.io/download",
    qrCode: "https://metamask.io/download",
  },
  mobile: {
    getUri: (uri: string) => `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
  },
  qrCode: {
    getUri: (uri: string) => `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
    instructions: {
      learnMoreUrl: "https://metamask.io/faqs/",
      steps: [
        {
          description: "wallet_connectors.metamask_mobile.qr_code.step1.description",
          step: "install",
          title: "wallet_connectors.metamask_mobile.qr_code.step1.title",
        },
        {
          description: "wallet_connectors.metamask_mobile.qr_code.step2.description",
          step: "create",
          title: "wallet_connectors.metamask_mobile.qr_code.step2.title",
        },
        {
          description: "wallet_connectors.metamask_mobile.qr_code.step3.description",
          step: "refresh",
          title: "wallet_connectors.metamask_mobile.qr_code.step3.title",
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({
    projectId,
    walletConnectParameters,
  }),
});
