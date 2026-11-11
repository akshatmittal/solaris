import React, { useEffect, useMemo, useState } from "react";

import { ConnectModalShellView } from "../../../components/ConnectOptions/ConnectModalShellView";
import { ConnectStatus } from "../../../components/ConnectOptions/ConnectStatus";
import {
  MobileWalletGroup,
  MobileWalletItemView,
  MobileWalletListView,
} from "../../../components/ConnectOptions/MobileWalletListView";
import { WalletListEmptyState } from "../../../components/ConnectOptions/WalletListEmptyState";
import { WalletListView, type WalletListViewItem, groupLabel } from "../../../components/ConnectOptions/WalletListView";
import { Dialog } from "../../../components/Dialog/Dialog";
import { DialogContent } from "../../../components/Dialog/DialogContent";
import { isMobile } from "../../../utils/isMobile";
import fallbackWalletIcon from "../../../wallets/walletConnectors/injectedWallet/injectedWallet.svg";
import { useSolanaConnectWallet, useSolanaWallet, useSolanaWalletConnectors } from "../../hooks";
import { addRecentSolanaWalletId, getRecentSolanaWalletIds } from "../../wallets/recentSolanaWalletIds";

const SOLANA_GET_WALLET_URL = "https://solana.com/solana-wallets";

export interface SolanaConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function SolanaConnectModal({ onClose, open }: SolanaConnectModalProps) {
  // Unique per instance so the EVM and Solana connect modals never share a
  // DOM id for their aria-labelledby headings.
  const titleId = `rk_connect_title_${React.useId()}`;
  const connectors = useSolanaWalletConnectors();
  const walletState = useSolanaWallet();
  const { connect, error, isConnecting, resetError } = useSolanaConnectWallet();
  const [selectedWallet, setSelectedWallet] = useState<WalletListViewItem>();
  // Back hides the status but keeps the selection, so picking the pending wallet again reopens its status.
  const [showStatus, setShowStatus] = useState(false);
  // The connecting status and the decline only show for a wallet picked since the modal opened.
  const declined = Boolean(selectedWallet && error);

  // The modal stays mounted while closed (unlike the EVM ConnectOptions, which unmount with the Dialog), so drop the
  // selection on close.
  useEffect(() => {
    if (!open) {
      setSelectedWallet(undefined);
      setShowStatus(false);
    }
  }, [open]);

  const wallets = useMemo(() => {
    const recentIds = new Set(getRecentSolanaWalletIds());

    return connectors
      .map<WalletListViewItem>((connector) => ({
        groupName: connector.ready ? "Installed" : "Other",
        iconUrl: connector.icon || fallbackWalletIcon,
        id: connector.id,
        isRainbowKitConnector: false,
        name: connector.name,
        ready: connector.ready,
        recent: recentIds.has(connector.id),
      }))
      .sort((a, b) => Number(b.recent) - Number(a.recent) || a.name.localeCompare(b.name));
  }, [connectors]);

  const groupedWallets = useMemo(() => {
    const installed = wallets.filter((wallet) => wallet.ready);
    const other = wallets.filter((wallet) => !wallet.ready);

    return {
      ...(installed.length ? { Installed: installed } : {}),
      ...(other.length ? { Other: other } : {}),
    };
  }, [wallets]);

  const selectWallet = async (wallet: WalletListViewItem) => {
    // walletState.isConnecting covers attempts started elsewhere (a
    // SolanaWalletButton or the silent auto-reconnect); starting another
    // connect would cancel the in-flight one.
    if (isConnecting || walletState.isConnecting) {
      if (wallet.id === selectedWallet?.id) {
        setShowStatus(true);
      }
      return;
    }

    if (!wallet.ready) {
      window.open(SOLANA_GET_WALLET_URL, "_blank", "noopener,noreferrer");
      return;
    }

    resetError();
    setSelectedWallet(wallet);
    setShowStatus(true);

    try {
      await connect(wallet.id);
      addRecentSolanaWalletId(wallet.id);
    } catch {
      // ConnectorKit exposes the error through the hook.
    }
  };

  const mobile = isMobile();
  const readyWallets = wallets.filter((wallet) => wallet.ready);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent wide>
        {mobile ? (
          <MobileWalletListView
            declined={declined}
            getWalletUrl={SOLANA_GET_WALLET_URL}
            onClose={onClose}
            titleId={titleId}
            walletItems={
              readyWallets.length > 0 ? (
                <MobileWalletGroup label={groupLabel("Installed")}>
                  {readyWallets.map((wallet) => (
                    <MobileWalletItemView
                      connecting={isConnecting && selectedWallet?.id === wallet.id}
                      iconUrl={wallet.iconUrl}
                      id={wallet.id}
                      key={wallet.id}
                      name={wallet.name}
                      onClick={() => selectWallet(wallet)}
                      ready={wallet.ready}
                      recent={wallet.recent}
                    />
                  ))}
                </MobileWalletGroup>
              ) : (
                <WalletListEmptyState
                  getWalletUrl={SOLANA_GET_WALLET_URL}
                  showAction={false}
                />
              )
            }
          />
        ) : (
          <ConnectModalShellView
            getWalletUrl={SOLANA_GET_WALLET_URL}
            hideFooter={wallets.length === 0}
            onClose={onClose}
            onRightPaneBack={() => setShowStatus(false)}
            rightPaneContent={
              showStatus &&
              selectedWallet && (
                <ConnectStatus
                  connectionError={declined}
                  onRetry={() => selectWallet(selectedWallet)}
                  titleId={titleId}
                  wallet={selectedWallet}
                />
              )
            }
            showRightPane={showStatus}
            showSidebar={!showStatus}
            titleId={titleId}
            walletList={
              wallets.length > 0 ? (
                <WalletListView
                  groupedWallets={groupedWallets}
                  onSelectWallet={selectWallet}
                />
              ) : (
                <WalletListEmptyState
                  getWalletUrl={SOLANA_GET_WALLET_URL}
                  showAction
                />
              )
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
