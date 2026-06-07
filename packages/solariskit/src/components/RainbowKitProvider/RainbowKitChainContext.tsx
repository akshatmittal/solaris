import React, { type ReactNode, createContext, useContext, useEffect, useMemo, useRef } from "react";

import type { Chain } from "wagmi/chains";

import { useChainId as useWagmiChainId, useConfig, useConnection, useSwitchChain } from "wagmi";

import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { provideRainbowKitChains } from "./provideRainbowKitChains";

export interface RainbowKitChain extends Chain {
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
}

interface RainbowKitChainContextValue {
  chains: RainbowKitChain[];
  initialChainId?: number;
  chainSearchThreshold: number;
}

const RainbowKitChainContext = createContext<RainbowKitChainContextValue>({
  chains: [],
  chainSearchThreshold: 5,
});

interface RainbowKitChainProviderProps {
  initialChain?: Chain | number;
  chainSearchThreshold?: number;
  children: ReactNode;
}

export function RainbowKitChainProvider({
  chainSearchThreshold = 5,
  children,
  initialChain,
}: RainbowKitChainProviderProps) {
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
    <RainbowKitChainContext.Provider
      value={useMemo(
        () => ({
          chains: provideRainbowKitChains(chains),
          chainSearchThreshold,
          initialChainId,
        }),
        [chainSearchThreshold, chains, initialChainId],
      )}
    >
      {children}
    </RainbowKitChainContext.Provider>
  );
}

export const useRainbowKitChains = () => useContext(RainbowKitChainContext).chains;

export const useChainSearchThreshold = () => useContext(RainbowKitChainContext).chainSearchThreshold;

export const useInitialChainId = () => useContext(RainbowKitChainContext).initialChainId;

export const useRainbowKitChainsById = () => {
  const rainbowkitChains = useRainbowKitChains();

  return useMemo(() => {
    const rainbowkitChainsById: Record<number, RainbowKitChain> = {};

    for (const rkChain of rainbowkitChains) {
      rainbowkitChainsById[rkChain.id] = rkChain;
    }

    return rainbowkitChainsById;
  }, [rainbowkitChains]);
};
