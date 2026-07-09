import { createConnector } from "wagmi";
import { injected } from "wagmi/connectors";

import type { WalletProviderFlags, WindowProvider } from "../types/utils";
import type { CreateConnector, WalletDetailsParams } from "./Wallet";

type InjectedParameters = NonNullable<Parameters<typeof injected>[0]>;
type InjectedTarget = Extract<InjectedParameters["target"], (window?: Window) => unknown>;
type InjectedProvider = NonNullable<ReturnType<InjectedTarget>>["provider"];

/*
 * Returns the explicit window provider that matches the flag and the flag is true
 */
function getExplicitInjectedProvider(flag: WalletProviderFlags): InjectedProvider | undefined {
  const _window = typeof window !== "undefined" ? (window as WindowProvider) : undefined;
  if (typeof _window === "undefined" || typeof _window.ethereum === "undefined") return;
  const providers = _window.ethereum.providers;
  return providers
    ? (providers.find((provider) => provider[flag]) as InjectedProvider | undefined)
    : _window.ethereum[flag]
      ? (_window.ethereum as InjectedProvider)
      : undefined;
}

/*
 * Gets the `window.namespace` window provider if it exists
 */
function getWindowProviderNamespace(namespace: string): InjectedProvider | undefined {
  const providerSearch = (provider: unknown, namespace: string): unknown => {
    if (provider === null || (typeof provider !== "object" && typeof provider !== "function")) return;

    const [property, ...path] = namespace.split(".");
    if (!property) return;
    const _provider = (provider as Record<string, unknown>)[property];
    if (_provider) {
      if (path.length === 0) return _provider;
      return providerSearch(_provider, path.join("."));
    }
  };
  if (typeof window !== "undefined") return providerSearch(window, namespace) as InjectedProvider | undefined;
}

/*
 * Checks if the explict provider or window ethereum exists
 */
export function hasInjectedProvider({ flag, namespace }: { flag?: WalletProviderFlags; namespace?: string }): boolean {
  if (namespace && typeof getWindowProviderNamespace(namespace) !== "undefined") return true;
  if (flag && typeof getExplicitInjectedProvider(flag) !== "undefined") return true;
  return false;
}

/*
 * Returns an injected provider that favors the flag match, but falls back to window.ethereum
 */
function getInjectedProvider({
  flag,
  namespace,
}: {
  flag?: WalletProviderFlags;
  namespace?: string;
}): InjectedProvider | undefined {
  const _window = typeof window !== "undefined" ? (window as WindowProvider) : undefined;
  if (typeof _window === "undefined") return;
  if (namespace) {
    // prefer custom eip1193 namespaces
    const windowProvider = getWindowProviderNamespace(namespace);
    if (windowProvider) return windowProvider;
  }
  const providers = _window.ethereum?.providers;
  if (flag) {
    const provider = getExplicitInjectedProvider(flag);
    if (provider) return provider;
  }
  // Wallet-specific lookups should not fall back to another injected provider.
  if (namespace || flag) return;
  if (typeof providers !== "undefined" && providers.length > 0) return providers[0] as InjectedProvider;
  return _window.ethereum as InjectedProvider | undefined;
}

function createInjectedConnector(provider?: InjectedProvider): CreateConnector {
  return (walletDetails: WalletDetailsParams) => {
    // Create the injected configuration object conditionally based on the provider.
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.rkDetails.id,
            name: walletDetails.rkDetails.name,
            provider,
          }),
        }
      : {};

    return createConnector((config) => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails,
    }));
  };
}

export function getInjectedConnector({
  flag,
  namespace,
  target,
}: {
  flag?: WalletProviderFlags;
  namespace?: string;
  target?: InjectedProvider;
}): CreateConnector {
  const provider = typeof target !== "undefined" ? target : getInjectedProvider({ flag, namespace });
  return createInjectedConnector(provider);
}
