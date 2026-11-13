import type { SolarisWalletConnectParameters, Wallet } from "../../Wallet";

import { getWalletConnectConnector } from "../../getWalletConnectConnector";

export interface WalletConnectWalletOptions {
  projectId: string;
  options?: SolarisWalletConnectParameters;
}

export const walletConnectWallet = ({ projectId, options }: WalletConnectWalletOptions): Wallet => {
  const getUri = (uri: string) => uri;

  return {
    id: "walletConnect",
    name: "WalletConnect",
    installed: undefined,
    iconUrl: async () => (await import("./walletConnectWallet.svg")).default,
    iconBackground: "#3b99fc",
    qrCode: { getUri },
    createConnector: getWalletConnectConnector({
      projectId,
      walletConnectParameters: options,
    }),
  };
};
