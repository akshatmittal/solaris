import React, { useEffect } from "react";

import type { SolanaConnectButtonProps } from "../../types";

import { abbreviateETHBalance } from "../../../components/ConnectButton/abbreviateETHBalance";
import { ConnectButtonView, defaultConnectButtonProps } from "../../../components/ConnectButton/ConnectButtonView";
import { formatAddress } from "../../../components/ConnectButton/formatAddress";
import { resolveShowBalance } from "../../../components/ConnectButton/resolveShowBalance";
import { useShowBalance } from "../../../components/RainbowKitProvider/ShowBalanceContext";
import { useHydrated } from "../../../hooks/useHydrated";
import { useSolanaBalance, useSolanaWallet } from "../../hooks";
import { useSolanaAccountModal, useSolanaConnectModal } from "../SolanaKitProvider/SolanaModalContext";

const noop = () => {};

export function SolanaConnectButton({
  accountStatus = defaultConnectButtonProps.accountStatus,
  label = defaultConnectButtonProps.label,
  showBalance = defaultConnectButtonProps.showBalance,
}: SolanaConnectButtonProps) {
  const wallet = useSolanaWallet();
  const { openAccountModal } = useSolanaAccountModal();
  const { openConnectModal } = useSolanaConnectModal();
  const { setShowBalance } = useShowBalance();
  const hydrated = useHydrated();

  useEffect(() => {
    setShowBalance(showBalance);
  }, [setShowBalance, showBalance]);

  const shouldShowBalance = resolveShowBalance(showBalance);

  const { lastUpdated, solBalance } = useSolanaBalance({
    enabled: wallet.isConnected && shouldShowBalance,
  });

  if (!hydrated) {
    return null;
  }

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
      buttonReady={hydrated}
      isConnected={wallet.isConnected}
      label={label}
      mounted={hydrated}
      onOpenAccountModal={openAccountModal ?? noop}
      onOpenConnectModal={openConnectModal ?? noop}
      showBalance={showBalance}
      testIdPrefix="solana-"
    />
  );
}
