import React, { useState } from "react";

import { type NetworkModalId, NetworkModalView } from "../../../components/ChainModal/NetworkModalView";
import { getChainIconUrl } from "../../../components/SolarisEthereumProvider/provideSolarisChains";
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
    // Match the EVM ChainModal: close on success only, and clear the pending
    // state on both success and failure. A rejected switch keeps the modal
    // open and is not an unhandled rejection.
    setCluster(clusterId as Parameters<typeof setCluster>[0])
      .then(onClose, () => {})
      .finally(() => {
        setPendingClusterId(null);
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
