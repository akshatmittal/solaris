import React, { useCallback, useRef, useState } from "react";

import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { setWalletConnectDeepLink } from "../RainbowKitProvider/walletConnectDeepLink";
import { GET_WALLET_URL } from "./constants";
import { MobileWalletGroup, MobileWalletItemView, MobileWalletListView } from "./MobileWalletListView";
import { groupLabel } from "./WalletListView";

export function useMobileConnect(wallet: WalletConnector, onClose: () => void) {
  const { connect, getMobileUri, id, name, showWalletConnectModal } = wallet;

  return useCallback(async () => {
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
      showWalletConnectModal();
      onClose?.();
      return;
    }

    await connect?.();
  }, [connect, getMobileUri, showWalletConnectModal, onClose, name, id]);
}

function WalletButton({
  connecting,
  onClose,
  onConnect,
  wallet,
}: {
  connecting: boolean;
  onClose: () => void;
  onConnect: (connect: () => Promise<void>) => void;
  wallet: WalletConnector;
}) {
  const connect = useMobileConnect(wallet, onClose);

  return (
    <MobileWalletItemView
      connecting={connecting}
      iconBackground={wallet.iconBackground}
      iconUrl={wallet.iconUrl}
      id={wallet.id}
      name={wallet.name}
      onClick={() => onConnect(connect)}
      ready={wallet.ready}
      recent={wallet.recent}
      shortName={wallet.shortName}
    />
  );
}

export function MobileOptions({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  const wallets = useWalletConnectors()
    .filter((wallet) => wallet.ready)
    .sort((a, b) => a.groupIndex - b.groupIndex);
  const groupedWallets = Object.groupBy(wallets, (wallet) => wallet.groupName);
  // The latest attempt; a late result from an earlier attempt does not change it.
  const [attempt, setAttempt] = useState<{ declined: boolean; id: string; key: number }>();
  const attemptKey = useRef(0);

  return (
    <MobileWalletListView
      declined={attempt?.declined ?? false}
      getWalletUrl={GET_WALLET_URL}
      onClose={onClose}
      titleId={titleId}
      walletItems={Object.entries(groupedWallets).map(([groupName, group]) => (
        <MobileWalletGroup
          key={groupName}
          label={groupLabel(groupName)}
        >
          {group?.map((wallet) => (
            <WalletButton
              connecting={attempt?.id === wallet.id && !attempt.declined}
              key={wallet.id}
              onClose={onClose}
              onConnect={async (connect) => {
                const key = ++attemptKey.current;
                setAttempt({ declined: false, id: wallet.id, key });
                try {
                  await connect();
                  setAttempt((current) => (current?.key === key ? undefined : current));
                } catch {
                  setAttempt((current) => (current?.key === key ? { declined: true, id: wallet.id, key } : current));
                }
              }}
              wallet={wallet}
            />
          ))}
        </MobileWalletGroup>
      ))}
    />
  );
}
