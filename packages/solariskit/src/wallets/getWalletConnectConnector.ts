import type { AppKit } from "@reown/appkit/core";
import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { CreateConnectorFn } from "wagmi";

import { type Chain, UserRejectedRequestError } from "viem";
import { createConnector } from "wagmi";
import { mock, type WalletConnectParameters, walletConnect } from "wagmi/connectors";

import type { CreateConnector, DefaultWalletOptions, WalletConnectModalSession, WalletDetailsParams } from "./Wallet";

interface CreateWalletConnectConnectorParams extends DefaultWalletOptions {
  walletDetails: WalletDetailsParams;
}

const isServer = typeof window === "undefined";

const walletConnectInstances = new Map<string, ReturnType<typeof walletConnect>>();

const getOrCreateWalletConnectInstance = ({
  projectId,
  metadata,
}: DefaultWalletOptions): ReturnType<typeof walletConnect> => {
  const config: WalletConnectParameters = {
    telemetryEnabled: false,
    metadata,
    projectId,
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

// AppKit runs on the provider's own WalletConnect client, so the modal and the Solaris QR code share one session.
async function createWalletConnectModal(
  provider: WalletConnectProvider,
  projectId: string,
  chains: readonly [Chain, ...Chain[]],
  metadata: DefaultWalletOptions["metadata"],
): Promise<AppKit> {
  let createAppKit: typeof import("@reown/appkit/core").createAppKit;
  try {
    ({ createAppKit } = await import(/* turbopackOptional: true */ "@reown/appkit/core"));
  } catch (error) {
    console.error(error);
    throw new Error("The WalletConnect modal needs the @reown/appkit package.", { cause: error });
  }
  const toNetwork = (chain: Chain) => ({
    ...chain,
    caipNetworkId: `eip155:${chain.id}` as const,
    chainNamespace: "eip155" as const,
  });
  const [firstChain, ...otherChains] = chains;

  return createAppKit({
    projectId,
    networks: [toNetwork(firstChain), ...otherChains.map(toNetwork)],
    universalProvider: provider.signer,
    manualWCControl: true,
    metadata: {
      name: metadata.name,
      description: metadata.description,
      url: metadata.url,
      icons: metadata.icons,
    },
    enableEIP6963: false,
    enableInjected: false,
    enableCoinbase: false,
    features: { analytics: false, email: false, socials: false },
  });
}

function createWalletConnectConnector({
  projectId,
  metadata,
  walletDetails,
}: CreateWalletConnectConnectorParams): CreateConnectorFn {
  // WalletConnect relies on browser-only APIs that aren't available during SSR
  if (isServer) {
    return createConnector((config) => ({
      ...mock({ accounts: ["0x0000000000000000000000000000000000000000"] })(config),
      ...walletDetails,
    }));
  }

  return createConnector((config) => {
    const connector = getOrCreateWalletConnectInstance({ projectId, metadata })(config);
    // The provider cannot cancel a pairing (abortPairingAttempt is a no-op), so closing the modal rejects connect() here.
    let cancelConnect: ((error: Error) => void) | undefined;
    let cancelError: Error | undefined;
    let sessionCount = 0;
    const cancel = (error: Error) => {
      if (cancelConnect) {
        cancelConnect(error);
      } else {
        cancelError = error;
      }
    };
    const connect: ReturnType<CreateConnectorFn>["connect"] = connector.connect;

    const openWalletConnectModal = async (): Promise<WalletConnectModalSession> => {
      const provider = await connector.getProvider();
      let modalPromise = walletConnectModals.get(provider);
      if (!modalPromise) {
        modalPromise = createWalletConnectModal(provider, projectId, config.chains, metadata).catch(
          (error: unknown) => {
            walletConnectModals.delete(provider);
            throw error;
          },
        );
        walletConnectModals.set(provider, modalPromise);
      }
      const modal = await modalPromise;
      cancelConnect = undefined;
      cancelError = undefined;
      const session = ++sessionCount;

      let opened = false;
      let closedByUs = false;
      const isActive = () => !closedByUs && session === sessionCount;
      const unsubscribe = modal.subscribeState((state) => {
        if (state.open) {
          opened = true;
        } else if (opened && isActive() && !provider.session) {
          cancel(new UserRejectedRequestError(new Error("The user closed the WalletConnect modal.")));
        }
      });
      // AppKit's open() does nothing when it thinks a wallet is connected, for example from stale storage.
      const shown = modal.open().then(() => {
        if (!modal.isOpen()) {
          throw new Error("The WalletConnect modal did not open.");
        }
      });
      shown.catch((error: unknown) => {
        if (isActive()) {
          cancel(error instanceof Error ? error : new Error("The WalletConnect modal failed to load."));
        }
      });

      return {
        shown,
        close: () => {
          unsubscribe();
          if (isActive()) {
            cancelError = undefined;
            void modal.close();
          }
          closedByUs = true;
        },
      };
    };

    return {
      ...connector,
      ...walletDetails,
      ...(walletDetails.solarisDetails.id === "walletConnect" ? { openWalletConnectModal } : {}),
      async connect<withCapabilities extends boolean = false>(parameters?: {
        chainId?: number | undefined;
        isReconnecting?: boolean | undefined;
        withCapabilities?: withCapabilities | boolean | undefined;
      }) {
        if (cancelError) {
          const error = cancelError;
          cancelError = undefined;
          throw error;
        }
        let reject: (error: Error) => void = () => {};
        const cancelled = new Promise<never>((_resolve, rejectCancelled) => {
          reject = rejectCancelled;
        });
        cancelConnect = reject;
        try {
          return await Promise.race([(connect<withCapabilities>).call(this, parameters), cancelled]);
        } finally {
          if (cancelConnect === reject) {
            cancelConnect = undefined;
          }
        }
      },
    };
  });
}

export function getWalletConnectConnector({ projectId, metadata }: DefaultWalletOptions): CreateConnector {
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
      metadata,
      walletDetails,
    });
}
