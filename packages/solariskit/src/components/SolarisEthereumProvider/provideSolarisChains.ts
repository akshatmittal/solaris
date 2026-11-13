import type { SolarisChain } from "./SolarisChainContext";

// TODO: Replace with this a generic from a trusted external source
export const getChainIconUrl = (chainId: number | "solana") =>
  `https://static.createmytoken.com/images/chains/${chainId}.png`;

/** @description Decorates an array of wagmi `Chain` objects with SolarisChain property overrides */
export const provideSolarisChains = <Chain extends SolarisChain>(chains: readonly [Chain, ...Chain[]]): Chain[] =>
  chains.map((chain) => ({
    ...chain,
    iconUrl: chain.iconUrl ?? getChainIconUrl(chain.id),
  })) as Chain[];
