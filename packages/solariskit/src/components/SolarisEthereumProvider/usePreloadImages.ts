import { useCallback, useEffect } from "react";

import { isNotNullish } from "../../utils/isNotNullish";
import { useWalletConnectors } from "../../wallets/useWalletConnectors";
import { loadImages } from "../AsyncImage/useAsyncImage";
import { useSolarisChains } from "./SolarisChainContext";

export function usePreloadImages() {
  const solarisChains = useSolarisChains();
  const walletConnectors = useWalletConnectors();

  const preloadImages = useCallback(() => {
    loadImages(
      ...walletConnectors.map((wallet) => wallet.iconUrl),
      ...solarisChains.map((chain) => chain.iconUrl).filter(isNotNullish),
    );
  }, [walletConnectors, solarisChains]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);
}
