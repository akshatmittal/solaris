import { useEffect, useSyncExternalStore } from "react";

import type { CreateConnectorFn } from "wagmi";

import { ProviderNotFoundError } from "wagmi";

// Connectors whose provider loads a wallet SDK with import(). Safe is not here: it loads its SDK only inside a Safe App
// iframe, where it must connect at page load.
const sdkConnectorTypes = new Set(["baseAccount", "walletConnect"]);
// Connector uids whose SDK a connect UI asked for, and whose SDK finished loading.
const requestedSdks = new Set<string>();
const loadedSdks = new Set<string>();

/**
 * Defers a connector's wallet SDK until a connect UI asks for it (see useWalletSdks), the connector connects, or the
 * connector was the last one used. Requests are per connector, so another wagmi config does not load its SDKs early.
 * Without this, wagmi's reconnect loads every wallet SDK when the page loads.
 */
export const lazyConnector =
  (createConnectorFn: CreateConnectorFn): CreateConnectorFn =>
  (config) => {
    const connector = createConnectorFn(config);
    if (!sdkConnectorTypes.has(connector.type)) {
      return connector;
    }

    let active = false;
    let setUp: Promise<void> | undefined;
    // Activation only goes from false to true: connect() can set it while the storage read waits.
    const isActive = async () => {
      if (
        !active &&
        (requestedSdks.has(config.emitter.uid) || (await config.storage?.getItem("recentConnectorId")) === connector.id)
      ) {
        active = true;
      }
      return active;
    };

    return {
      ...connector,
      async setup() {
        if (await isActive()) {
          setUp ??= connector.setup?.call(this);
          await setUp;
        }
      },
      async getProvider(parameters) {
        if (!(await isActive())) {
          throw new ProviderNotFoundError();
        }
        // wagmi ran setup() before the connector was active, so run it on first use.
        setUp ??= connector.setup?.call(this);
        return connector.getProvider.call(this, parameters);
      },
      async connect<withCapabilities extends boolean = false>(parameters?: {
        chainId?: number | undefined;
        isReconnecting?: boolean | undefined;
        withCapabilities?: withCapabilities | boolean | undefined;
      }) {
        active = true;
        // An app can connect without a Solaris UI. WalletConnect needs its setup() listeners before it connects.
        if (connector.setup) {
          setUp ??= connector.setup.call(this);
          await setUp;
        }
        return (connector.connect<withCapabilities>).call(this, parameters);
      },
    };
  };

const loadedListeners = new Set<() => void>();
let loadedCount = 0;
const subscribeLoaded = (listener: () => void) => {
  loadedListeners.add(listener);
  return () => {
    loadedListeners.delete(listener);
  };
};
const getLoadedCount = () => loadedCount;

/**
 * Starts loading a connector's wallet SDK once.
 */
export function requestWalletSdk(wallet: { getProvider: () => Promise<unknown>; uid: string }) {
  if (requestedSdks.has(wallet.uid)) {
    return;
  }
  requestedSdks.add(wallet.uid);
  wallet
    .getProvider()
    .catch(() => {
      // A failed load shows on connect, the same as before.
    })
    .finally(() => {
      loadedSdks.add(wallet.uid);
      loadedCount++;
      for (const listener of loadedListeners) {
        listener();
      }
    });
}

/**
 * Starts loading the wallet SDKs of the given wallets, and returns the ids of the wallets whose SDK is still loading.
 */
export function useWalletSdks(
  wallets: readonly { getProvider: () => Promise<unknown>; id: string; type: string; uid: string }[],
): ReadonlySet<string> {
  useSyncExternalStore(subscribeLoaded, getLoadedCount, getLoadedCount);
  const loading = wallets.filter((wallet) => sdkConnectorTypes.has(wallet.type) && !loadedSdks.has(wallet.uid));

  useEffect(() => {
    for (const wallet of loading) {
      requestWalletSdk(wallet);
    }
  }, [loading]);

  return new Set(loading.map((wallet) => wallet.id));
}
