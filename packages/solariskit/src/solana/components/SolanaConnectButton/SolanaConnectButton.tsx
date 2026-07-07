import React, { useEffect, useState } from "react";

import type { SolanaConnectButtonProps } from "../../types";

import { abbreviateETHBalance } from "../../../components/ConnectButton/abbreviateETHBalance";
import { ConnectButtonView } from "../../../components/ConnectButton/ConnectButtonView";
import { formatAddress } from "../../../components/ConnectButton/formatAddress";
import { useShowBalance } from "../../../components/RainbowKitProvider/ShowBalanceContext";
import { normalizeResponsiveValue } from "../../../css/sprinkles.css";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { isMobile } from "../../../utils/isMobile";
import { useSolanaBalance, useSolanaWallet } from "../../hooks";
import { useSolanaAccountModal, useSolanaConnectModal } from "../SolanaKitProvider/SolanaModalContext";

const defaultProps = {
  accountStatus: "full",
  label: "Connect Wallet",
  showBalance: { largeScreen: true, smallScreen: false },
} as const;

const noop = () => {};

export function SolanaConnectButton({
  accountStatus = defaultProps.accountStatus,
  label = defaultProps.label,
  showBalance = defaultProps.showBalance,
}: SolanaConnectButtonProps) {
  const wallet = useSolanaWallet();
  const { openAccountModal } = useSolanaAccountModal();
  const { openConnectModal } = useSolanaConnectModal();
  const isMounted = useIsMounted();
  const { setShowBalance } = useShowBalance();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowBalance(showBalance);
    if (!ready) setReady(true);
  }, [ready, setShowBalance, showBalance]);

  const shouldShowBalance = (() => {
    if (typeof showBalance === "boolean") {
      return showBalance;
    }

    return normalizeResponsiveValue(showBalance)[isMobile() ? "smallScreen" : "largeScreen"];
  })();

  const { lastUpdated, solBalance } = useSolanaBalance({
    enabled: wallet.isConnected && shouldShowBalance,
  });

  if (!ready) {
    return null;
  }

  const mounted = isMounted();
  const account = wallet.account
    ? {
        address: wallet.account,
        // lastUpdated is null until a fetch succeeds; the hook defaults the
        // balance to 0 while loading, so gate on it to avoid "0 SOL".
        displayBalance: shouldShowBalance && lastUpdated ? `${abbreviateETHBalance(solBalance)} SOL` : undefined,
        displayName: formatAddress(wallet.account),
        hasPendingTransactions: false,
      }
    : undefined;

  return (
    <ConnectButtonView
      account={account}
      accountStatus={accountStatus}
      buttonReady={mounted}
      isConnected={wallet.isConnected}
      label={label}
      mounted={mounted}
      onOpenAccountModal={openAccountModal ?? noop}
      onOpenConnectModal={openConnectModal ?? noop}
      showBalance={showBalance}
    />
  );
}

SolanaConnectButton.__defaultProps = defaultProps;
