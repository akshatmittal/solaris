import { useEffect, useSyncExternalStore } from "react";

import type { CreateConnectorFn } from "wagmi";

import { ProviderNotFoundError } from "wagmi";

// Connectors whose provider loads a wallet SDK with import().
const sdkConnectorTypes = new Set(["baseAccount", "safe", "walletConnect"]);
const loadedSdks = new Set<string>();
let sdksRequested = false;

/**
 * Defers a connector's wallet SDK until a connect UI asks for it (see useWalletSdks), the connector connects, or the
 * connector was the last one used. Without this, wagmi's reconnect loads every wallet SDK when the page loads.
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
    const isActive = async () => {
      active ||= sdksRequested || (await config.storage?.getItem("recentConnectorId")) === connector.id;
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
      connect<withCapabilities extends boolean = false>(parameters?: {
        chainId?: number | undefined;
        isReconnecting?: boolean | undefined;
        withCapabilities?: withCapabilities | boolean | undefined;
      }) {
        active = true;
        return connector.connect<withCapabilities>(parameters);
      },
    };
  };

const requestedSdks = new Set<string>();
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
 * Starts loading the wallet SDKs of the given wallets, and returns the ids of the wallets whose SDK is still loading.
 */
export function useWalletSdks(
  wallets: readonly { getProvider: () => Promise<unknown>; id: string; type: string; uid: string }[],
): ReadonlySet<string> {
  useSyncExternalStore(subscribeLoaded, getLoadedCount, getLoadedCount);
  const loading = wallets.filter((wallet) => sdkConnectorTypes.has(wallet.type) && !loadedSdks.has(wallet.uid));

  useEffect(() => {
    sdksRequested = true;
    for (const wallet of loading) {
      if (requestedSdks.has(wallet.uid)) {
        continue;
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
  }, [loading]);

  return new Set(loading.map((wallet) => wallet.id));
}
