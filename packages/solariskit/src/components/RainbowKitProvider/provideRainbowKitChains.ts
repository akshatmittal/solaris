import type { RainbowKitChain } from "./RainbowKitChainContext";

// TODO: Replace with this a generic from a trusted external source
const getChainIconUrl = (chainId: number) =>
  `https://static.createmytoken.com/images/chains/${chainId}.png`;

/** @description Decorates an array of wagmi `Chain` objects with RainbowKitChain property overrides */
export const provideRainbowKitChains = <Chain extends RainbowKitChain>(
  chains: readonly [Chain, ...Chain[]],
): Chain[] =>
  chains.map((chain) => ({
    ...chain,
    iconUrl: chain.iconUrl ?? getChainIconUrl(chain.id),
  })) as Chain[];
