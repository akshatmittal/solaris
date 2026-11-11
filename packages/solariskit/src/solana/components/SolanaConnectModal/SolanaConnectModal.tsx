import React, { useEffect, useMemo, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { ConnectModalShellView } from "../../../components/ConnectOptions/ConnectModalShellView";
import {
  MobileWalletGroup,
  MobileWalletItemView,
  MobileWalletListView,
} from "../../../components/ConnectOptions/MobileWalletListView";
import { WalletListEmptyState } from "../../../components/ConnectOptions/WalletListEmptyState";
import { WalletListView, type WalletListViewItem, groupLabel } from "../../../components/ConnectOptions/WalletListView";
import { Dialog } from "../../../components/Dialog/Dialog";
import { DialogContent } from "../../../components/Dialog/DialogContent";
import { Text } from "../../../components/Text/Text";
import { isMobile } from "../../../utils/isMobile";
import fallbackWalletIcon from "../../../wallets/walletConnectors/injectedWallet/injectedWallet.svg";
import { useSolanaConnectWallet, useSolanaWallet, useSolanaWalletConnectors } from "../../hooks";
import { addRecentSolanaWalletId, getRecentSolanaWalletIds } from "../../wallets/recentSolanaWalletIds";

const SOLANA_GET_WALLET_URL = "https://solana.com/solana-wallets";

const styles = stylex.create({
  error: {
    marginTop: 12,
    paddingInline: 4,
  },
});

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
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>();

  // The modal stays mounted while closed (unlike the EVM ConnectOptions,
  // which unmount with the Dialog), so reset transient state on close: no
  // stale selection highlight or error text on the next open.
  useEffect(() => {
    if (!open) {
      setSelectedWalletId(undefined);
      resetError();
    }
  }, [open, resetError]);

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
    if (isConnecting || walletState.isConnecting) return;

    if (!wallet.ready) {
      window.open(SOLANA_GET_WALLET_URL, "_blank", "noopener,noreferrer");
      return;
    }

    resetError();
    setSelectedWalletId(wallet.id);

    try {
      await connect(wallet.id);
      addRecentSolanaWalletId(wallet.id);
    } catch {
      // ConnectorKit exposes the error through the hook.
    }
  };

  const mobile = isMobile();
  const readyWallets = wallets.filter((wallet) => wallet.ready);
  const walletList = (
    <>
      {wallets.length > 0 ? (
        <WalletListView
          groupedWallets={groupedWallets}
          onSelectWallet={selectWallet}
          selectedWalletId={selectedWalletId}
        />
      ) : (
        <WalletListEmptyState
          getWalletUrl={SOLANA_GET_WALLET_URL}
          showAction
        />
      )}
      {error ? (
        <Text
          color="error"
          size="14"
          weight="medium"
          xstyle={styles.error}
        >
          {error.message}
        </Text>
      ) : null}
    </>
  );

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent wide>
        {mobile ? (
          <MobileWalletListView
            error={error?.message}
            getWalletUrl={SOLANA_GET_WALLET_URL}
            onClose={onClose}
            titleId={titleId}
            walletItems={
              readyWallets.length > 0 ? (
                <MobileWalletGroup label={groupLabel("Installed")}>
                  {readyWallets.map((wallet) => (
                    <MobileWalletItemView
                      connecting={isConnecting && selectedWalletId === wallet.id}
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
            rightPaneContent={null}
            showRightPane={false}
            showSidebar
            titleId={titleId}
            walletList={walletList}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
