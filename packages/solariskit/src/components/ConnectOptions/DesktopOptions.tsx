import React, { useContext, useEffect, useRef, useState } from "react";

import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { groupBy } from "../../utils/groupBy";
import { addLatestWalletId } from "../../wallets/latestWalletId";
import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { ConnectModalIntro } from "../ConnectModal/ConnectModalIntro";
import { ModalSizeContext, ModalSizeOptions } from "../RainbowKitProvider/ModalSizeContext";
import { WalletButtonContext } from "../RainbowKitProvider/WalletButtonContext";
import { ConnectDetail } from "./ConnectDetails";
import { ConnectModalShellView } from "./ConnectModalShellView";
import { GET_WALLET_URL } from "./constants";
import { WalletListView } from "./WalletListView";

export enum WalletStep {
  None = "NONE",
  LearnCompact = "LEARN_COMPACT",
  Connect = "CONNECT",
}

export function DesktopOptions({ onClose }: { onClose: () => void }) {
  const titleId = "rk_connect_title";
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [selectedWallet, setSelectedWallet] = useState<WalletConnector>();
  const [qrCodeUri, setQrCodeUri] = useState<string>();
  const hasQrCode = !!selectedWallet?.qrCode && qrCodeUri;
  const [connectionError, setConnectionError] = useState(false);
  const [walletStep, setWalletStep] = useState<WalletStep>(WalletStep.None);
  const modalSize = useContext(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;
  const safari = isSafari();

  const initialized = useRef(false);
  const selectWalletRef = useRef<((wallet: WalletConnector) => Promise<void>) | null>(null);

  const { connector } = useContext(WalletButtonContext);

  // The `WalletButton` component made the connect modal appear empty when trying to connect.
  // This happened because of a mix up between EIP-6963 and RainbowKit connectors.
  // The problem was finding the correct `wallet.id`. `WalletButton` uses RainbowKit's id,
  // but EIP-6963 uses `rdns` for its id. We now don't merge EIP-6963 and RainbowKit
  // connectors if user interacts with `WalletButton` component.
  const mergeEIP6963WithRkConnectors = !connector;

  const wallets = useWalletConnectors(mergeEIP6963WithRkConnectors)
    .filter((wallet) => wallet.ready)
    .sort((a, b) => a.groupIndex - b.groupIndex);
  const groupedWallets = groupBy(wallets, (wallet) => wallet.groupName);

  const connectToWallet = (wallet: WalletConnector) => {
    setConnectionError(false);
    if (wallet.ready) {
      wallet?.connect?.()?.catch(() => {
        setConnectionError(true);
      });
    }
  };

  const onDesktopUri = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);

    if (!sWallet?.getDesktopUri) return;

    setTimeout(async () => {
      const uri = await sWallet?.getDesktopUri?.();
      if (uri) window.open(uri, safari ? "_blank" : "_self");
    }, 0);
  };

  const onQrCode = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);

    const uri = await sWallet?.getQrCodeUri?.();

    setQrCodeUri(uri);

    // This timeout prevents the UI from flickering if connection is instant,
    // otherwise users will see a flash of the "connecting" state.
    setTimeout(
      () => {
        setSelectedWallet(sWallet);
        changeWalletStep(WalletStep.Connect);
      },
      uri ? 0 : 50,
    );
  };

  const selectWallet = async (wallet: WalletConnector) => {
    // We still want to get the latest wallet id to show connected
    // green badge on our custom WalletButton API
    addLatestWalletId(wallet.id);

    // This ensures that we listen to the connector "message" event
    // before connecting to the wallet
    if (wallet.ready) {
      onQrCode(wallet);
      onDesktopUri(wallet);
    }

    connectToWallet(wallet);
    setSelectedOptionId(wallet.id);

    if (!wallet.ready) {
      window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer");
      return;
    }
  };
  selectWalletRef.current = selectWallet;

  // If a user hasn't installed the extension we will get the
  // qr code with additional steps on how to get the wallet
  useEffect(() => {
    if (connector && !initialized.current) {
      setWalletStep(WalletStep.Connect);
      selectWalletRef.current?.(connector);
      initialized.current = true;
    }
  }, [connector]);

  const clearSelectedWallet = () => {
    setSelectedOptionId(undefined);
    setSelectedWallet(undefined);
    setQrCodeUri(undefined);
  };
  const changeWalletStep = (newWalletStep: WalletStep) => {
    setWalletStep(newWalletStep);
  };
  let walletContent = null;
  let headerLabel = null;
  let headerBackButtonLink: WalletStep | null = null;
  let headerBackButtonCallback: (() => void) | undefined;

  useEffect(() => {
    setConnectionError(false);
  }, [walletStep, selectedWallet]);

  switch (walletStep) {
    case WalletStep.None:
      walletContent = (
        <ConnectModalIntro getWallet={() => window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer")} />
      );
      break;
    case WalletStep.LearnCompact:
      walletContent = (
        <ConnectModalIntro
          compactModeEnabled={compactModeEnabled}
          getWallet={() => window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer")}
        />
      );
      headerLabel = t("intro.title");
      headerBackButtonLink = WalletStep.None;
      break;
    case WalletStep.Connect:
      walletContent = selectedWallet && (
        <ConnectDetail
          compactModeEnabled={compactModeEnabled}
          connectionError={connectionError}
          onClose={onClose}
          qrCodeUri={qrCodeUri}
          reconnect={connectToWallet}
          wallet={selectedWallet}
        />
      );
      headerLabel =
        hasQrCode &&
        (selectedWallet.name === "WalletConnect"
          ? t("connect_scan.fallback_title")
          : t("connect_scan.title", {
              wallet: selectedWallet.name,
            }));
      headerBackButtonLink = compactModeEnabled ? (connector ? null : WalletStep.None) : null;
      headerBackButtonCallback = compactModeEnabled ? (!connector ? clearSelectedWallet : () => {}) : () => {};
      break;
    default:
      break;
  }
  const backButtonLink = headerBackButtonLink;

  return (
    <ConnectModalShellView
      compactModeEnabled={compactModeEnabled}
      onClose={onClose}
      onCompactInfoClick={() => changeWalletStep(WalletStep.LearnCompact)}
      onRightPaneBack={
        backButtonLink
          ? () => {
              changeWalletStep(backButtonLink);
              headerBackButtonCallback?.();
            }
          : undefined
      }
      rightPaneContent={walletContent}
      rightPaneHeaderLabel={headerLabel}
      showRightPane={compactModeEnabled ? walletStep !== WalletStep.None : true}
      showSidebar={compactModeEnabled ? walletStep === WalletStep.None : true}
      titleId={titleId}
      walletList={
        <WalletListView
          groupedWallets={groupedWallets}
          onSelectWallet={(wallet) => selectWallet(wallet as WalletConnector)}
          selectedWalletId={selectedOptionId}
        />
      }
    />
  );
}
