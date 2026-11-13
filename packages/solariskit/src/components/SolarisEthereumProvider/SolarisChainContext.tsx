import React, { type ReactNode, createContext, useContext, useEffect, useMemo, useRef } from "react";

import type { Chain } from "wagmi/chains";

import { useChainId as useWagmiChainId, useConfig, useConnection, useSwitchChain } from "wagmi";

import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { provideSolarisChains } from "./provideSolarisChains";

export interface SolarisChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

interface SolarisChainContextValue {
  chains: SolarisChain[];
  initialChainId?: number;
  chainSearchThreshold: number;
}

const SolarisChainContext = createContext<SolarisChainContextValue>({
  chains: [],
  chainSearchThreshold: 5,
});

interface SolarisChainProviderProps {
  initialChain?: Chain | number;
  chainSearchThreshold?: number;
  children: ReactNode;
}

export function SolarisChainProvider({ chainSearchThreshold = 5, children, initialChain }: SolarisChainProviderProps) {
  const { chains } = useConfig();
  const { status } = useConnection();
  const wagmiChainId = useWagmiChainId();
  const { mutate: switchChain } = useSwitchChain();
  const appliedInitialChainIdRef = useRef<number | undefined>(undefined);
  const initialChainId = typeof initialChain === "number" ? initialChain : initialChain?.id;
  const configuredInitialChainId = isChainIdSupported(chains, initialChainId) ? initialChainId : undefined;

  useEffect(() => {
    if (status !== "disconnected" || configuredInitialChainId == null) return;
    if (appliedInitialChainIdRef.current === configuredInitialChainId) return;

    appliedInitialChainIdRef.current = configuredInitialChainId;

    if (wagmiChainId !== configuredInitialChainId) {
      switchChain({ chainId: configuredInitialChainId });
    }
  }, [configuredInitialChainId, status, switchChain, wagmiChainId]);

  return (
    <SolarisChainContext.Provider
      value={useMemo(
        () => ({
          chains: provideSolarisChains(chains),
          chainSearchThreshold,
          initialChainId,
        }),
        [chainSearchThreshold, chains, initialChainId],
      )}
    >
      {children}
    </SolarisChainContext.Provider>
  );
}

export const useSolarisChains = () => useContext(SolarisChainContext).chains;

export const useChainSearchThreshold = () => useContext(SolarisChainContext).chainSearchThreshold;

export const useInitialChainId = () => useContext(SolarisChainContext).initialChainId;

export const useSolarisChainsById = () => {
  const solarisChains = useSolarisChains();

  return useMemo(() => {
    const solarisChainsById: Record<number, SolarisChain> = {};

    for (const solarisChain of solarisChains) {
      solarisChainsById[solarisChain.id] = solarisChain;
    }

    return solarisChainsById;
  }, [solarisChains]);
};
