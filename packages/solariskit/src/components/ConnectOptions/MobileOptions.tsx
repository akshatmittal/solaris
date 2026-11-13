import React, { useRef, useState } from "react";

import { useWalletSdks } from "../../wallets/lazyConnector";
import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { setWalletConnectDeepLink } from "../RainbowKitProvider/walletConnectDeepLink";
import { ConnectModalShellView } from "./ConnectModalShellView";
import { ConnectStatus } from "./ConnectStatus";
import { GET_WALLET_URL } from "./constants";
import { WalletListView } from "./WalletListView";

// Opens the wallet app through its deep link, then connects.
export async function connectMobile(wallet: WalletConnector, onClose: () => void) {
  const { connect, getMobileUri, id, name, showWalletConnectModal } = wallet;

  const onMobileUri = async () => {
    const mobileUri = await getMobileUri?.();

    if (!mobileUri) return;

    if (mobileUri) {
      setWalletConnectDeepLink({ mobileUri, name });
    }

    if (mobileUri.startsWith("http")) {
      // Workaround for the upstream RainbowKit issue #524.
      // Using 'window.open' causes issues on iOS in non-Safari browsers and
      // WebViews where a blank tab is left behind after connecting.
      // This is especially bad in some WebView scenarios (e.g. following a
      // link from Twitter) where the user doesn't have any mechanism for
      // closing the blank tab.
      // For whatever reason, links with a target of "_blank" don't suffer
      // from this problem, and programmatically clicking a detached link
      // element with the same attributes also avoids the issue.
      const link = document.createElement("a");
      link.href = mobileUri;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.click();
    } else {
      window.location.href = mobileUri;
    }
  };

  if (id !== "walletConnect") onMobileUri();

  // If the id is "walletConnect" then "showWalletConnectModal" will always be true
  if (showWalletConnectModal) {
    await showWalletConnectModal(onClose);
    return;
  }

  await connect?.();
}

export function MobileOptions({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  const wallets = useWalletConnectors()
    .filter((wallet) => wallet.ready)
    .sort((a, b) => a.groupIndex - b.groupIndex);
  const loadingSdks = useWalletSdks(wallets);
  const groupedWallets = Object.groupBy(
    wallets.map((wallet) => ({ ...wallet, loading: loadingSdks.has(wallet.id) })),
    (wallet) => wallet.groupName,
  );
  // The latest attempt; a late result from an earlier attempt does not change it.
  const [attempt, setAttempt] = useState<{ declined: boolean; id: string; key: number }>();
  const attemptKey = useRef(0);
  // The wallet whose status pane shows; Back clears it.
  const [statusWallet, setStatusWallet] = useState<WalletConnector>();

  const selectWallet = async (wallet: WalletConnector) => {
    const key = ++attemptKey.current;
    setAttempt({ declined: false, id: wallet.id, key });
    setStatusWallet(wallet);
    try {
      await connectMobile(wallet, onClose);
      setAttempt((current) => (current?.key === key ? undefined : current));
    } catch {
      setAttempt((current) => (current?.key === key ? { declined: true, id: wallet.id, key } : current));
    }
  };

  return (
    <ConnectModalShellView
      getWalletUrl={GET_WALLET_URL}
      onClose={onClose}
      onRightPaneBack={() => setStatusWallet(undefined)}
      rightPaneContent={
        statusWallet && (
          <ConnectStatus
            connectionError={attempt?.id === statusWallet.id && attempt.declined ? "declined" : null}
            mobile
            onRetry={() => selectWallet(statusWallet)}
            titleId={titleId}
            wallet={statusWallet}
          />
        )
      }
      showRightPane={statusWallet !== undefined}
      showSidebar={statusWallet === undefined}
      titleId={titleId}
      walletList={
        <WalletListView
          connectingWalletId={attempt && !attempt.declined ? attempt.id : undefined}
          groupedWallets={groupedWallets}
          onSelectWallet={(item) => {
            const wallet = wallets.find((w) => w.id === item.id);
            if (wallet) {
              selectWallet(wallet);
            }
          }}
        />
      }
    />
  );
}
