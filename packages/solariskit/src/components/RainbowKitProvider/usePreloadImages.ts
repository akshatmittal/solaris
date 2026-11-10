import { useCallback, useEffect } from "react";

import { isNotNullish } from "../../utils/isNotNullish";
import { useWalletConnectors } from "../../wallets/useWalletConnectors";
import { loadImages } from "../AsyncImage/useAsyncImage";
import { useRainbowKitChains } from "./RainbowKitChainContext";

export function usePreloadImages() {
  const rainbowKitChains = useRainbowKitChains();
  const walletConnectors = useWalletConnectors();

  const preloadImages = useCallback(() => {
    loadImages(
      ...walletConnectors.map((wallet) => wallet.iconUrl),
      ...rainbowKitChains.map((chain) => chain.iconUrl).filter(isNotNullish),
    );
  }, [walletConnectors, rainbowKitChains]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);
}
