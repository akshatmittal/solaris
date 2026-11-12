import React, { useContext, useEffect, useRef, useState } from "react";

import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { addLatestWalletId } from "../../wallets/latestWalletId";
import { useWalletSdks } from "../../wallets/lazyConnector";
import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { WalletButtonContext } from "../RainbowKitProvider/WalletButtonContext";
import { ConnectDetail } from "./ConnectDetails";
import { ConnectModalShellView } from "./ConnectModalShellView";
import { type ConnectionError } from "./ConnectStatus";
import { GET_WALLET_URL } from "./constants";
import { WalletListView } from "./WalletListView";

export enum WalletStep {
  None = "NONE",
  Connect = "CONNECT",
}

export function DesktopOptions({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [selectedWallet, setSelectedWallet] = useState<WalletConnector>();
  const [qrCodeUri, setQrCodeUri] = useState<string>();
  const [connectionError, setConnectionError] = useState<ConnectionError | null>(null);
  const [walletStep, setWalletStep] = useState<WalletStep>(WalletStep.None);
  const safari = isSafari();

  const initialized = useRef(false);
  const selectWalletRef = useRef<((wallet: WalletConnector) => Promise<void>) | null>(null);
  const qrRequestIdRef = useRef(0);
  const stopQrCodeRef = useRef<(() => void) | undefined>(undefined);
  const connectAttemptRef = useRef(0);

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
  const loadingSdks = useWalletSdks(wallets);
  const groupedWallets = Object.groupBy(
    wallets.map((wallet) => ({ ...wallet, loading: loadingSdks.has(wallet.id) })),
    (wallet) => wallet.groupName,
  );

  const connectToWallet = (wallet: WalletConnector) => {
    // Only the latest attempt reports a decline, so a late rejection from a previous wallet does not show on the current one.
    const attempt = ++connectAttemptRef.current;
    setConnectionError(null);
    if (wallet.ready) {
      wallet?.connect?.()?.catch(() => {
        if (attempt === connectAttemptRef.current) {
          setConnectionError("declined");
        }
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

  const onQrCode = (wallet: WalletConnector) => {
    // Token guards against out-of-order completion: clicking wallet B right after wallet A must not let A's timer apply
    // A's details over B's.
    const requestId = ++qrRequestIdRef.current;
    stopQrCodeRef.current?.();
    const sWallet = wallets.find((w) => wallet.id === w.id);
    setQrCodeUri(undefined);

    if (!sWallet?.watchQrCodeUri) {
      // This timeout prevents the UI from flickering if connection is instant,
      // otherwise users will see a flash of the "connecting" state.
      setTimeout(() => {
        if (requestId !== qrRequestIdRef.current) return;
        setSelectedWallet(sWallet);
        changeWalletStep(WalletStep.Connect);
      }, 50);
      return;
    }

    // QR wallets open the QR step at once. The QR shows a spinner until the wallet returns its URI, which can take
    // about a second.
    setSelectedWallet(sWallet);
    changeWalletStep(WalletStep.Connect);

    // WalletConnect does not reject when its relay is unreachable, so the QR step shows Retry after 30s without a URI.
    const qrTimeout = setTimeout(() => {
      setConnectionError((error) => error ?? "qr_timeout");
    }, 30_000);
    // Each connect cancels the pairing of the connect before it, so the newest URI replaces the QR code.
    const stopWatching = sWallet.watchQrCodeUri((uri) => {
      clearTimeout(qrTimeout);
      setQrCodeUri(uri);
    });
    stopQrCodeRef.current = () => {
      clearTimeout(qrTimeout);
      stopWatching();
    };
  };

  useEffect(() => () => stopQrCodeRef.current?.(), []);

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
    qrRequestIdRef.current++;
    stopQrCodeRef.current?.();
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

  switch (walletStep) {
    case WalletStep.None:
      break;
    case WalletStep.Connect:
      walletContent = selectedWallet && (
        <ConnectDetail
          connectionError={connectionError}
          onClose={onClose}
          qrCodeUri={qrCodeUri}
          reconnect={(wallet) => {
            onQrCode(wallet);
            connectToWallet(wallet);
          }}
          titleId={titleId}
          wallet={selectedWallet}
        />
      );
      headerLabel =
        selectedWallet?.qrCode &&
        (qrCodeUri || !connectionError) &&
        (selectedWallet.name === "WalletConnect"
          ? t("connect_scan.fallback_title")
          : t("connect_scan.title", {
              wallet: selectedWallet.shortName ?? selectedWallet.name,
            }));
      headerBackButtonLink = connector ? null : WalletStep.None;
      headerBackButtonCallback = connector ? undefined : clearSelectedWallet;
      break;
    default:
      break;
  }
  const backButtonLink = headerBackButtonLink;

  return (
    <ConnectModalShellView
      getWalletUrl={GET_WALLET_URL}
      onClose={onClose}
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
      showRightPane={walletStep !== WalletStep.None}
      showSidebar={walletStep === WalletStep.None}
      titleId={titleId}
      walletList={
        <WalletListView
          groupedWallets={groupedWallets}
          onSelectWallet={(item) => {
            const wallet = wallets.find((w) => w.id === item.id);
            if (wallet) {
              selectWallet(wallet);
            }
          }}
          selectedWalletId={selectedOptionId}
        />
      }
    />
  );
}
