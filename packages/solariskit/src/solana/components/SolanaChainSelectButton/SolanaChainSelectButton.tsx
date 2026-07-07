import React, { useEffect, useState } from "react";

import type { SolanaChainSelectButtonProps } from "../../types";

import { NetworkSelectButtonView } from "../../../components/ChainSelectButton/NetworkSelectButtonView";
import { getChainIconUrl } from "../../../components/RainbowKitProvider/provideRainbowKitChains";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { useSolanaCluster } from "../../hooks";
import { useSolanaChainModal } from "../SolanaKitProvider/SolanaModalContext";

const defaultProps = {
  chainStatus: { largeScreen: "full", smallScreen: "icon" },
} as const;
const solanaIconUrl = getChainIconUrl("solana");

export function SolanaChainSelectButton({ chainStatus = defaultProps.chainStatus }: SolanaChainSelectButtonProps) {
  const { cluster, clusters } = useSolanaCluster();
  const { openChainModal } = useSolanaChainModal();
  const isMounted = useIsMounted();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <NetworkSelectButtonView
      buttonReady={isMounted()}
      chainStatus={chainStatus}
      network={
        cluster
          ? {
              hasIcon: true,
              iconUrl: solanaIconUrl,
              id: cluster.id,
              name: cluster.label,
              unsupported: false,
            }
          : undefined
      }
      networkCount={clusters.length}
      onOpenNetworkModal={openChainModal}
    />
  );
}

SolanaChainSelectButton.__defaultProps = defaultProps;
