import React, { useCallback, useEffect, useRef } from "react";

import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { Box } from "../Box/Box";
import { setWalletConnectDeepLink } from "../RainbowKitProvider/walletConnectDeepLink";
import { GET_WALLET_URL } from "./constants";
import { MobileWalletItemView, MobileWalletListView } from "./MobileWalletListView";

export function WalletButton({
  onClose,
  wallet,
  connecting,
}: {
  wallet: WalletConnector;
  onClose: () => void;
  connecting?: boolean;
}) {
  const { connect, iconBackground, iconUrl, id, name, getMobileUri, ready, shortName, showWalletConnectModal } = wallet;

  const initialized = useRef(false);

  const onConnect = useCallback(async () => {
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

  useEffect(() => {
    // When using `reactStrictMode: true` in development mode the useEffect hook
    // will fire twice. We avoid this by using `useRef` logic here. Works for now.
    if (connecting && !initialized.current) {
      onConnect();
      initialized.current = true;
    }
  }, [connecting, onConnect]);

  return (
    <MobileWalletItemView
      connecting={connecting}
      iconAccent={wallet.iconAccent}
      iconBackground={iconBackground}
      iconUrl={iconUrl}
      id={id}
      name={name}
      onClick={onConnect}
      ready={ready}
      recent={wallet.recent}
      shortName={shortName}
    />
  );
}

export function MobileOptions({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  const wallets = useWalletConnectors().filter((wallet) => wallet.isRainbowKitConnector);

  return (
    <MobileWalletListView
      getWalletUrl={GET_WALLET_URL}
      onClose={onClose}
      titleId={titleId}
      walletItems={wallets
        .filter((wallet) => wallet.ready)
        .map((wallet) => (
          <Box
            key={wallet.id}
            width="60"
          >
            <WalletButton
              onClose={onClose}
              wallet={wallet}
            />
          </Box>
        ))}
    />
  );
}
