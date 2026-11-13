import type { AppKit } from "@reown/appkit/core";
import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { Chain } from "viem";
import type { CreateConnectorFn } from "wagmi";

import { createConnector } from "wagmi";
import { mock, type WalletConnectParameters, walletConnect } from "wagmi/connectors";

import type {
  CreateConnector,
  SolarisWalletConnectParameters,
  WalletConnectModalSession,
  WalletDetailsParams,
} from "./Wallet";

interface GetWalletConnectConnectorParams {
  projectId: string;
  walletConnectParameters?: SolarisWalletConnectParameters;
}

interface CreateWalletConnectConnectorParams {
  projectId: string;
  walletDetails: WalletDetailsParams;
  walletConnectParameters?: SolarisWalletConnectParameters;
}

const isServer = typeof window === "undefined";

const walletConnectInstances = new Map<string, ReturnType<typeof walletConnect>>();

const getOrCreateWalletConnectInstance = (
  projectId: string,
  walletConnectParameters: SolarisWalletConnectParameters | undefined,
): ReturnType<typeof walletConnect> => {
  const config: WalletConnectParameters = {
    telemetryEnabled: false,
    // Earlier versions kept the QR connector's session under this prefix, so those sessions still restore.
    customStoragePrefix: "clientTwo",
    ...walletConnectParameters,
    projectId,
    // Solaris shows its own QR code, and opens the WalletConnect modal itself with openWalletConnectModal.
    showQrModal: false,
  };

  const serializedConfig = JSON.stringify(config);
  const sharedWalletConnector = walletConnectInstances.get(serializedConfig);
  if (sharedWalletConnector) {
    return sharedWalletConnector;
  }

  const newWalletConnectInstance = walletConnect(config);
  walletConnectInstances.set(serializedConfig, newWalletConnectInstance);
  return newWalletConnectInstance;
};

type WalletConnectProvider = InstanceType<typeof EthereumProvider>;

const walletConnectModals = new WeakMap<WalletConnectProvider, Promise<AppKit>>();

// Creates the WalletConnect modal (Reown AppKit) on the provider's own WalletConnect client, so the modal and the
// Solaris QR code share one session. The modal shows the URI of the next connect() on that client.
async function createWalletConnectModal(
  provider: WalletConnectProvider,
  projectId: string,
  chains: readonly [Chain, ...Chain[]],
  walletConnectParameters: SolarisWalletConnectParameters | undefined,
): Promise<AppKit> {
  let createAppKit: typeof import("@reown/appkit/core").createAppKit;
  try {
    ({ createAppKit } = await import(/* turbopackOptional: true */ "@reown/appkit/core"));
  } catch {
    throw new Error("The WalletConnect modal needs the @reown/appkit package.");
  }
  const toNetwork = (chain: Chain) => ({
    ...chain,
    caipNetworkId: `eip155:${chain.id}` as const,
    chainNamespace: "eip155" as const,
  });
  const [firstChain, ...otherChains] = chains;
  const metadata = walletConnectParameters?.metadata;
  const qrModalOptions = walletConnectParameters?.qrModalOptions;
  const themeVariables = qrModalOptions?.themeVariables;
  const zIndex = themeVariables?.["--wcm-z-index"];
  const recommendedWalletIds = qrModalOptions?.explorerRecommendedWalletIds;
  const excludedWalletIds = qrModalOptions?.explorerExcludedWalletIds;

  return createAppKit({
    projectId,
    networks: [toNetwork(firstChain), ...otherChains.map(toNetwork)],
    universalProvider: provider.signer,
    manualWCControl: true,
    metadata: metadata && {
      name: metadata.name,
      description: metadata.description,
      url: metadata.url,
      icons: metadata.icons,
    },
    themeMode: qrModalOptions?.themeMode,
    themeVariables: themeVariables && {
      "--w3m-font-family": themeVariables["--wcm-font-family"],
      "--w3m-accent": themeVariables["--wcm-accent-color"],
      "--w3m-color-mix": themeVariables["--wcm-background-color"],
      "--w3m-color-mix-strength": 0,
      "--w3m-z-index": zIndex ? Number(zIndex) : undefined,
      "--w3m-qr-color": themeVariables["--wcm-accent-color"],
      "--w3m-font-size-master": themeVariables["--wcm-text-medium-regular-size"],
      "--w3m-border-radius-master": themeVariables["--wcm-container-border-radius"],
    },
    connectorImages: qrModalOptions?.walletImages,
    featuredWalletIds: Array.isArray(recommendedWalletIds) ? recommendedWalletIds : undefined,
    excludeWalletIds: Array.isArray(excludedWalletIds) ? excludedWalletIds : undefined,
    customWallets: [
      ...(qrModalOptions?.mobileWallets ?? []).map(({ id, name, links }) => ({ id, name, mobile_link: links.native })),
      ...(qrModalOptions?.desktopWallets ?? []).map(({ id, name, links }) => ({
        id,
        name,
        desktop_link: links.native,
      })),
    ],
    termsConditionsUrl: qrModalOptions?.termsOfServiceUrl,
    privacyPolicyUrl: qrModalOptions?.privacyPolicyUrl,
    enableMobileFullScreen: qrModalOptions?.enableMobileFullScreen,
    enableEIP6963: false,
    enableInjected: false,
    enableCoinbase: false,
    features: { analytics: false, email: false, socials: false },
  });
}

function createWalletConnectConnector({
  projectId,
  walletDetails,
  walletConnectParameters,
}: CreateWalletConnectConnectorParams): CreateConnectorFn {
  // WalletConnect relies on browser-only APIs that aren't available during SSR
  if (isServer) {
    return createConnector((config) => ({
      ...mock({ accounts: ["0x0000000000000000000000000000000000000000"] })(config),
      ...walletDetails,
    }));
  }

  return createConnector((config) => {
    const connector = getOrCreateWalletConnectInstance(projectId, walletConnectParameters)(config);

    return {
      ...connector,
      ...walletDetails,
      async openWalletConnectModal(): Promise<WalletConnectModalSession> {
        const provider = await connector.getProvider();
        let modalPromise = walletConnectModals.get(provider);
        if (!modalPromise) {
          modalPromise = createWalletConnectModal(provider, projectId, config.chains, walletConnectParameters).catch(
            (error: unknown) => {
              walletConnectModals.delete(provider);
              throw error;
            },
          );
          walletConnectModals.set(provider, modalPromise);
        }
        const modal = await modalPromise;

        let opened = false;
        let closedByUs = false;
        // Closing the modal before a wallet connects aborts the pairing, so the pending connect() rejects.
        const unsubscribe = modal.subscribeState((state) => {
          if (state.open) {
            opened = true;
          } else if (opened && !closedByUs && !provider.session) {
            provider.signer.abortPairingAttempt();
          }
        });
        const shown = modal.open();

        return {
          shown,
          close: () => {
            closedByUs = true;
            unsubscribe();
            void modal.close();
          },
        };
      },
    };
  });
}

export function getWalletConnectConnector({
  projectId,
  walletConnectParameters,
}: GetWalletConnectConnectorParams): CreateConnector {
  // We use this projectId in place of YOUR_PROJECT_ID for our examples.
  // This allows us our examples and templates to be functional with WalletConnect v2.
  // We warn developers against using this projectId in their dApp in production.
  const exampleProjectId = "21fef48091f12692cad574a6f7753643";

  if (!projectId || projectId === "") {
    throw new Error(
      "No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2.",
    );
  }

  if (projectId === "YOUR_PROJECT_ID") {
    projectId = exampleProjectId;
  }

  return (walletDetails: WalletDetailsParams) =>
    createWalletConnectConnector({
      projectId,
      walletDetails,
      walletConnectParameters,
    });
}
