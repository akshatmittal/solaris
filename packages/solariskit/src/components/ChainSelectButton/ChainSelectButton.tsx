import React from "react";

import { useConfig, useConnection } from "wagmi";

import type { ResponsiveValue } from "../../css/sprinkles.css";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { useHydrated } from "../../hooks/useHydrated";
import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { useChainModal } from "../RainbowKitProvider/ModalContext";
import { useRainbowKitChains, useRainbowKitChainsById } from "../RainbowKitProvider/RainbowKitChainContext";
import { NetworkSelectButtonView, defaultNetworkSelectChainStatus } from "./NetworkSelectButtonView";

export type ChainStatus = "full" | "icon" | "name" | "none";

export interface ChainSelectButtonProps {
  chainStatus?: ResponsiveValue<ChainStatus>;
}

export function ChainSelectButton({ chainStatus = defaultNetworkSelectChainStatus }: ChainSelectButtonProps) {
  const chains = useRainbowKitChains();
  const chainsById = useRainbowKitChainsById();
  const connectionStatus = useConnectionStatus();
  const { openChainModal } = useChainModal();
  const { chainId: connectedChainId } = useConnection();
  const chainId = useSelectedChainId(connectedChainId);
  const { chains: wagmiChains } = useConfig();
  const isConnectedChainSupported = connectedChainId ? isChainIdSupported(wagmiChains, connectedChainId) : true;
  const hydrated = useHydrated();
  const chainMetadata = chainId ? chainsById[chainId] : undefined;
  const resolvedChainIconUrl = useAsyncImage(chainMetadata?.iconUrl ?? undefined);
  const chain = chainId
    ? {
        hasIcon: Boolean(chainMetadata?.iconUrl),
        iconBackground: chainMetadata?.iconBackground,
        iconUrl: resolvedChainIconUrl,
        id: chainId,
        name: chainMetadata?.name ?? undefined,
        unsupported: !isConnectedChainSupported,
      }
    : undefined;

  if (!hydrated) {
    return null;
  }

  return (
    <NetworkSelectButtonView
      buttonReady={connectionStatus !== "loading"}
      chainStatus={chainStatus}
      network={chain}
      networkCount={chains.length}
      onOpenNetworkModal={openChainModal}
    />
  );
}
