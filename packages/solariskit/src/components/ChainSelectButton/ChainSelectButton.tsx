import React, { useEffect, useState } from "react";

import { useConfig, useConnection } from "wagmi";

import type { ResponsiveValue } from "../../css/sprinkles.css";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { useChainModal } from "../RainbowKitProvider/ModalContext";
import { useRainbowKitChains, useRainbowKitChainsById } from "../RainbowKitProvider/RainbowKitChainContext";
import { NetworkSelectButtonView } from "./NetworkSelectButtonView";

export type ChainStatus = "full" | "icon" | "name" | "none";

export interface ChainSelectButtonProps {
  chainStatus?: ResponsiveValue<ChainStatus>;
}

const defaultProps = {
  chainStatus: { largeScreen: "full", smallScreen: "icon" },
} as const;

export function ChainSelectButton({ chainStatus = defaultProps.chainStatus }: ChainSelectButtonProps) {
  const chains = useRainbowKitChains();
  const chainsById = useRainbowKitChainsById();
  const connectionStatus = useConnectionStatus();
  const { openChainModal } = useChainModal();
  const { chainId: connectedChainId } = useConnection();
  const chainId = useSelectedChainId(connectedChainId);
  const { chains: wagmiChains } = useConfig();
  const isConnectedChainSupported = connectedChainId ? isChainIdSupported(wagmiChains, connectedChainId) : true;
  const isMounted = useIsMounted();
  const [ready, setReady] = useState(false);
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

  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <NetworkSelectButtonView
      buttonReady={isMounted() && connectionStatus !== "loading"}
      chainStatus={chainStatus}
      network={chain}
      networkCount={chains.length}
      onOpenNetworkModal={openChainModal}
    />
  );
}

ChainSelectButton.__defaultProps = defaultProps;
