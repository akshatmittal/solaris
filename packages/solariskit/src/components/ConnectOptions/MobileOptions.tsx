import React, { useCallback } from "react";

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

    try {
      await connect?.();
    } catch {
      // Ignore connection errors so they don't surface as uncaught
    }
  }, [connect, getMobileUri, showWalletConnectModal, onClose, name, id]);
}

function WalletButton({ onClose, wallet }: { wallet: WalletConnector; onClose: () => void }) {
  const onConnect = useMobileConnect(wallet, onClose);

  return (
    <MobileWalletItemView
      iconBackground={wallet.iconBackground}
      iconUrl={wallet.iconUrl}
      id={wallet.id}
      name={wallet.name}
      onClick={onConnect}
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

  return (
    <MobileWalletListView
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
              key={wallet.id}
              onClose={onClose}
              wallet={wallet}
            />
          ))}
        </MobileWalletGroup>
      ))}
    />
  );
}
