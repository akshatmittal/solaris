import React, { type ReactNode, createContext, useContext, useMemo } from "react";

import type { Chain } from "wagmi/chains";

import { useConfig } from "wagmi";

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

  return (
    <RainbowKitChainContext.Provider
      value={useMemo(
        () => ({
          chains: provideRainbowKitChains(chains),
          chainSearchThreshold,
          initialChainId: typeof initialChain === "number" ? initialChain : initialChain?.id,
        }),
        [chainSearchThreshold, chains, initialChain],
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
