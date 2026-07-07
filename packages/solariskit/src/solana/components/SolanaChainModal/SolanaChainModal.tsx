import React, { useState } from "react";

import { type NetworkModalId, NetworkModalView } from "../../../components/ChainModal/NetworkModalView";
import { getChainIconUrl } from "../../../components/RainbowKitProvider/provideRainbowKitChains";
import { useSolanaCluster } from "../../hooks";

export interface SolanaChainModalProps {
  open: boolean;
  onClose: () => void;
}

const solanaIconUrl = getChainIconUrl("solana");

export function SolanaChainModal({ onClose, open }: SolanaChainModalProps) {
  const { cluster, clusters, setCluster } = useSolanaCluster();
  const [pendingClusterId, setPendingClusterId] = useState<string | null>(null);

  const onSelectNetwork = (networkId: NetworkModalId) => {
    const clusterId = String(networkId);

    setPendingClusterId(clusterId);
    // Match the EVM ChainModal's onSettled behavior: close and clear the
    // pending state on both success and failure instead of leaving a
    // rejected switch as an unhandled rejection with the modal stuck open.
    setCluster(clusterId as Parameters<typeof setCluster>[0])
      .catch(() => {})
      .finally(() => {
        setPendingClusterId(null);
        onClose();
      });
  };

  return (
    <NetworkModalView
      currentNetworkId={cluster?.id}
      networks={clusters.map((cluster) => ({
        iconUrl: solanaIconUrl,
        id: cluster.id,
        name: cluster.label,
      }))}
      onClose={onClose}
      onSelectNetwork={onSelectNetwork}
      open={open}
      pendingNetworkId={pendingClusterId}
      searchThreshold={5}
    />
  );
}
