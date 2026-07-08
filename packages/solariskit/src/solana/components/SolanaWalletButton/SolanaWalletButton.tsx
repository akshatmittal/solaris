import React, { type JSX, type ReactNode, useMemo, useState } from "react";

import type { SolanaWalletButtonProps } from "../../types";

import { WalletButtonView } from "../../../components/WalletButton/WalletButtonView";
import { useIsMounted } from "../../../hooks/useIsMounted";
import fallbackWalletIcon from "../../../wallets/walletConnectors/injectedWallet/injectedWallet.svg";
import { useSolanaConnectWallet, useSolanaWallet, useSolanaWalletConnectors } from "../../hooks";
import { addLatestSolanaWalletId, addRecentSolanaWalletId } from "../../wallets/recentSolanaWalletIds";
import { useSolanaConnectModal } from "../SolanaKitProvider/SolanaModalContext";

export interface SolanaWalletButtonRendererProps {
  connectorId?: string;
  children: (renderProps: {
    connected: boolean;
    connector: {
      iconBackground?: string;
      iconUrl?: string;
      id: string;
      name: string;
      ready: boolean;
    };
    connect: () => Promise<void>;
    error: boolean;
    loading: boolean;
    mounted: boolean;
    ready: boolean;
  }) => ReactNode;
}

function SolanaWalletButtonRenderer({ children, connectorId }: SolanaWalletButtonRendererProps) {
  const connectors = useSolanaWalletConnectors();
  const wallet = useSolanaWallet();
  const { connect } = useSolanaConnectWallet();
  const { openConnectModal } = useSolanaConnectModal();
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const connector = useMemo(
    () =>
      connectorId
        ? connectors.find((connector) => connector.id === connectorId)
        : (connectors.find((connector) => connector.ready) ?? connectors[0]),
    [connectorId, connectors],
  );

  // Wallet Standard connectors are detected at runtime, so the list is empty
  // during SSR and in browsers without a Solana wallet installed.
  if (!connector) {
    return (
      <>
        {children({
          connected: false,
          connector: {
            iconUrl: fallbackWalletIcon,
            id: connectorId ?? "unknown",
            name: connectorId ?? "Wallet",
            ready: false,
          },
          connect: async () => openConnectModal?.(),
          error: isError,
          loading: false,
          mounted: isMounted(),
          ready: false,
        })}
      </>
    );
  }

  const connectWallet = async () => {
    if (!connector.ready) {
      openConnectModal?.();
      return;
    }

    try {
      setLoading(true);
      if (isError) setIsError(false);
      await connect(connector.id);
      addLatestSolanaWalletId(connector.id);
      addRecentSolanaWalletId(connector.id);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children({
        connected: wallet.isConnected && wallet.connectorId === connector.id,
        connector: {
          iconUrl: connector.icon || fallbackWalletIcon,
          id: connector.id,
          name: connector.name,
          ready: connector.ready,
        },
        connect: connectWallet,
        error: isError,
        loading,
        mounted: isMounted(),
        ready: !wallet.isConnecting && !!openConnectModal,
      })}
    </>
  );
}

export const SolanaWalletButton: {
  (props: SolanaWalletButtonProps): JSX.Element;
  Custom: (props: SolanaWalletButtonRendererProps) => ReactNode;
} = ({ connectorId }) => (
  <SolanaWalletButtonRenderer connectorId={connectorId}>
    {({ connected, connector, connect, loading, mounted, ready }) => (
      <WalletButtonView
        connected={connected}
        connector={connector}
        loading={loading}
        mounted={mounted}
        onConnect={connect}
        ready={ready}
      />
    )}
  </SolanaWalletButtonRenderer>
);

SolanaWalletButton.Custom = SolanaWalletButtonRenderer;
