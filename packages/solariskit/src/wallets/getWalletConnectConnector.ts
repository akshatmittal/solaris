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
  metadata: DefaultWalletOptions["metadata"],
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
    // Rejects the pending connect() when the WalletConnect modal closes or fails to load. The provider has no way to
    // cancel a pairing, so its own connect() stays pending until the pairing expires or the next connect() replaces it.
    let cancelConnect: ((error: Error) => void) | undefined;
    // A modal that closes or fails before connect() starts rejects that connect() when it starts.
    let cancelError: Error | undefined;
    const cancel = (error: Error) => {
      if (cancelConnect) {
        cancelConnect(error);
      } else {
        cancelError = error;
      }
    };
    const connect: ReturnType<CreateConnectorFn>["connect"] = connector.connect;

    return {
      ...connector,
      ...walletDetails,
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
          // An earlier connect() can settle after a newer one started, so it clears only its own cancel.
          if (cancelConnect === reject) {
            cancelConnect = undefined;
          }
        }
      },
      async openWalletConnectModal(): Promise<WalletConnectModalSession> {
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
        cancelError = undefined;

        let opened = false;
        let closedByUs = false;
        const unsubscribe = modal.subscribeState((state) => {
          if (state.open) {
            opened = true;
          } else if (opened && !closedByUs && !provider.session) {
            cancel(new UserRejectedRequestError(new Error("The user closed the WalletConnect modal.")));
          }
        });
        const shown = modal.open();
        shown.catch((error: unknown) => {
          cancel(error instanceof Error ? error : new Error("The WalletConnect modal failed to load."));
        });

        return {
          shown,
          close: () => {
            closedByUs = true;
            cancelError = undefined;
            unsubscribe();
            void modal.close();
          },
        };
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
