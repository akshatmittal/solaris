import React from "react";

import type { SolanaChainSelectButtonProps } from "../../types";

import {
  NetworkSelectButtonView,
  defaultNetworkSelectChainStatus,
} from "../../../components/ChainSelectButton/NetworkSelectButtonView";
import { getChainIconUrl } from "../../../components/RainbowKitProvider/provideRainbowKitChains";
import { useHydrated } from "../../../hooks/useHydrated";
import { useSolanaCluster } from "../../hooks";
import { useSolanaChainModal } from "../SolanaKitProvider/SolanaModalContext";

const solanaIconUrl = getChainIconUrl("solana");

export function SolanaChainSelectButton({
  chainStatus = defaultNetworkSelectChainStatus,
}: SolanaChainSelectButtonProps) {
  const { cluster, clusters } = useSolanaCluster();
  const { openChainModal } = useSolanaChainModal();
  const hydrated = useHydrated();

  if (!hydrated) {
    return null;
  }

  return (
    <NetworkSelectButtonView
      buttonReady={hydrated}
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
      testIdPrefix="solana-"
    />
  );
}
