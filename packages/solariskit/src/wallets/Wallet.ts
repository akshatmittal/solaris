import type { Connector, CreateConnectorFn } from "wagmi";
import type { WalletConnectParameters } from "wagmi/connectors";

import type { WalletConnectWalletOptions } from "./walletConnectors/walletConnectWallet/walletConnectWallet";

type SolarisConnector = {
  mobile?: {
    getUri?: (uri: string) => string;
  };
  desktop?: {
    getUri?: (uri: string) => string;
  };
  qrCode?: {
    getUri: (uri: string) => string;
  };
};

export type Wallet = {
  id: string;
  aliases?: string[];
  name: string;
  rdns?: string;
  shortName?: string;
  iconUrl: string | (() => Promise<string>);
  iconAccent?: string;
  iconBackground: string;
  installed?: boolean;
  hidden?: () => boolean;
  createConnector: (walletDetails: WalletDetailsParams) => CreateConnectorFn;
} & SolarisConnector;

export interface DefaultWalletOptions {
  projectId: string;
  walletConnectParameters?: SolarisWalletConnectParameters;
}

type WalletAppOptions = {
  appName: string;
  appIcon?: string;
};

export type CreateWalletFn = (
  // These parameters will be used when creating a wallet. If injected
  // wallet doesn't have parameters it will just ignore these passed in parameters
  createWalletParams: WalletAppOptions & Omit<WalletConnectWalletOptions, "projectId"> & DefaultWalletOptions,
) => Wallet;

export type WalletList = {
  groupName: string;
  wallets: CreateWalletFn[];
}[];

// We don't want users to pass in `showQrModal` or `projectId`.
// Those two values are handled by Solaris. The rest of WalletConnect
// parameters can be passed with no issue
export type SolarisWalletConnectParameters = Omit<WalletConnectParameters, "showQrModal" | "projectId">;

export type SolarisDetails = Omit<Wallet, "createConnector" | "hidden"> & {
  index: number;
  groupIndex: number;
  groupName: string;
  isSolarisConnector: boolean;
};

export type WalletDetailsParams = { solarisDetails: SolarisDetails };

export type CreateConnector = (walletDetails: { solarisDetails: SolarisDetails }) => CreateConnectorFn;

// This is the default connector you get at first from wagmi
// "Connector" + Solaris details we inject into the connector
export type WagmiConnectorInstance = Connector & {
  // this is optional since we only get
  // solarisDetails if we use Solaris connectors
  solarisDetails?: SolarisDetails;
  // Opens the WalletConnect modal (Reown AppKit) on this connector's provider. Only the WalletConnect connector has it.
  openWalletConnectModal?: () => Promise<WalletConnectModalSession>;
};

export type WalletConnectModalSession = {
  // Resolves when the modal shows its UI.
  shown: Promise<void>;
  close: () => void;
};

// This will be the wallet instance we will return
// in the Solaris connect modal
export type WalletInstance = Connector & SolarisDetails & Pick<WagmiConnectorInstance, "openWalletConnectModal">;
