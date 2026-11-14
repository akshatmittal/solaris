import type { DefaultWalletOptions, Wallet } from "../../Wallet";

import { getWalletConnectConnector } from "../../getWalletConnectConnector";

export const walletConnectWallet = ({ projectId, metadata }: DefaultWalletOptions): Wallet => {
  const getUri = (uri: string) => uri;

  return {
    id: "walletConnect",
    name: "WalletConnect",
    installed: undefined,
    iconUrl: async () => (await import("./walletConnectWallet.svg")).default,
    iconBackground: "#3b99fc",
    qrCode: { getUri },
    createConnector: getWalletConnectConnector({ projectId, metadata }),
  };
};
