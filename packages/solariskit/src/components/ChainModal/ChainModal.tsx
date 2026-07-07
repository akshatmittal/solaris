import React, { useState } from "react";

import { useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { useConfig } from "wagmi";

import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { useChainSearchThreshold, useRainbowKitChains } from "../RainbowKitProvider/RainbowKitChainContext";
import { type NetworkModalId, NetworkModalView } from "./NetworkModalView";

export interface ChainModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChainModal({ onClose, open }: ChainModalProps) {
  const { chainId: connectedChainId, isConnected } = useConnection();
  const currentChainId = useSelectedChainId(connectedChainId);
  const { chains } = useConfig();
  const [pendingChainId, setPendingChainId] = useState<number | null>(null);
  const { mutate: switchChain } = useSwitchChain({
    mutation: {
      onMutate: ({ chainId: _chainId }) => {
        setPendingChainId(_chainId);
      },
      onSettled: () => {
        setPendingChainId(null);
        onClose();
      },
    },
  });
  const { mutate: disconnect } = useDisconnect();
  const isConnectedToUnsupportedChain = isConnected && !isChainIdSupported(chains, connectedChainId);
  const rainbowkitChains = useRainbowKitChains();
  const chainSearchThreshold = useChainSearchThreshold();
  const onSelectNetwork = (networkId: NetworkModalId) => {
    if (typeof networkId !== "number") return;
    switchChain({ chainId: networkId });
  };

  return (
    <NetworkModalView
      currentNetworkId={currentChainId ?? undefined}
      isConnectedToUnsupportedNetwork={isConnectedToUnsupportedChain}
      networks={rainbowkitChains.map(({ iconBackground, iconUrl, id, name }) => ({
        iconBackground,
        iconUrl,
        id,
        name,
      }))}
      onClose={onClose}
      onDisconnectUnsupported={() => disconnect()}
      onSelectNetwork={onSelectNetwork}
      open={open}
      pendingNetworkId={pendingChainId}
      searchThreshold={chainSearchThreshold}
    />
  );
}
