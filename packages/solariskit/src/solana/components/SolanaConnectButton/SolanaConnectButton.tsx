import React, { useEffect, useState } from "react";

import type { SolanaConnectButtonProps } from "../../types";

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

  const { formattedSol } = useSolanaBalance({
    enabled: wallet.isConnected && shouldShowBalance,
  });

  if (!ready) {
    return null;
  }

  const mounted = isMounted();
  const account = wallet.account
    ? {
        address: wallet.account,
        displayBalance: shouldShowBalance ? formattedSol : undefined,
        displayName: formatAddress(wallet.account),
        hasPendingTransactions: false,
      }
    : undefined;

  return (
    <ConnectButtonView
      account={account}
      accountStatus={accountStatus}
      buttonReady={mounted && !wallet.isConnecting}
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
