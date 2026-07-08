import React, { useEffect, useMemo, useState } from "react";

import { Box } from "../../../components/Box/Box";
import { ConnectModalIntro } from "../../../components/ConnectModal/ConnectModalIntro";
import { ConnectModalShellView } from "../../../components/ConnectOptions/ConnectModalShellView";
import { MobileWalletItemView, MobileWalletListView } from "../../../components/ConnectOptions/MobileWalletListView";
import { WalletListView, type WalletListViewItem } from "../../../components/ConnectOptions/WalletListView";
import { Dialog } from "../../../components/Dialog/Dialog";
import { DialogContent } from "../../../components/Dialog/DialogContent";
import { ModalSizeContext, ModalSizeOptions } from "../../../components/RainbowKitProvider/ModalSizeContext";
import { Text } from "../../../components/Text/Text";
import { t } from "../../../translations";
import { isMobile } from "../../../utils/isMobile";
import fallbackWalletIcon from "../../../wallets/walletConnectors/injectedWallet/injectedWallet.svg";
import { useSolanaConnectWallet, useSolanaWallet, useSolanaWalletConnectors } from "../../hooks";
import {
  addLatestSolanaWalletId,
  addRecentSolanaWalletId,
  getRecentSolanaWalletIds,
} from "../../wallets/recentSolanaWalletIds";

enum SolanaWalletStep {
  List = "LIST",
  LearnCompact = "LEARN_COMPACT",
}

const SOLANA_GET_WALLET_URL = "https://solana.com/ecosystem/explore?categories=wallet";

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
  const [walletStep, setWalletStep] = useState<SolanaWalletStep>(SolanaWalletStep.List);
  const modalSize = React.useContext(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;

  // The modal stays mounted while closed (unlike the EVM ConnectOptions,
  // which unmount with the Dialog), so reset transient state on close: no
  // stale selection highlight, error text, or compact learn-more step on
  // the next open.
  useEffect(() => {
    if (!open) {
      setSelectedWalletId(undefined);
      setWalletStep(SolanaWalletStep.List);
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
      // Only persist after a successful connect: addLatestSolanaWalletId also
      // re-enables auto-reconnect, which must not happen on a rejected attempt.
      addLatestSolanaWalletId(wallet.id);
      addRecentSolanaWalletId(wallet.id);
    } catch {
      // ConnectorKit exposes the error through the hook.
    }
  };

  const mobile = isMobile();
  const walletList = (
    <>
      <WalletListView
        groupedWallets={groupedWallets}
        onSelectWallet={selectWallet}
        selectedWalletId={selectedWalletId}
      />
      {error ? (
        <Box
          marginTop="12"
          marginX="6"
        >
          <Text
            color="error"
            size="14"
            weight="medium"
          >
            {error.message}
          </Text>
        </Box>
      ) : null}
    </>
  );

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent
        bottomSheetOnMobile
        padding="0"
        wide={!compactModeEnabled}
      >
        {mobile ? (
          <MobileWalletListView
            getWalletUrl={SOLANA_GET_WALLET_URL}
            onClose={onClose}
            titleId={titleId}
            walletItems={wallets
              .filter((wallet) => wallet.ready)
              .map((wallet) => (
                <Box
                  key={wallet.id}
                  width="60"
                >
                  <MobileWalletItemView
                    connecting={isConnecting && selectedWalletId === wallet.id}
                    iconUrl={wallet.iconUrl}
                    id={wallet.id}
                    name={wallet.name}
                    onClick={() => selectWallet(wallet)}
                    ready={wallet.ready}
                    recent={wallet.recent}
                  />
                </Box>
              ))}
          />
        ) : (
          <ConnectModalShellView
            compactModeEnabled={compactModeEnabled}
            onClose={onClose}
            onCompactInfoClick={() => setWalletStep(SolanaWalletStep.LearnCompact)}
            onRightPaneBack={compactModeEnabled ? () => setWalletStep(SolanaWalletStep.List) : undefined}
            rightPaneContent={
              <ConnectModalIntro
                compactModeEnabled={compactModeEnabled}
                getWallet={() => window.open(SOLANA_GET_WALLET_URL, "_blank", "noopener,noreferrer")}
              />
            }
            rightPaneHeaderLabel={compactModeEnabled ? t("intro.title") : null}
            showRightPane={compactModeEnabled ? walletStep !== SolanaWalletStep.List : true}
            showSidebar={compactModeEnabled ? walletStep === SolanaWalletStep.List : true}
            titleId={titleId}
            walletList={walletList}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
