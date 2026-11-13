import { mainnet } from "wagmi/chains";

import { useSolarisChains } from "../components/SolarisEthereumProvider/SolarisChainContext";

export function useIsMainnetConfigured() {
  const solarisChains = useSolarisChains();

  const chainId = mainnet.id;

  const configured = solarisChains.some((solarisChain) => solarisChain.id === chainId);

  return configured;
}
