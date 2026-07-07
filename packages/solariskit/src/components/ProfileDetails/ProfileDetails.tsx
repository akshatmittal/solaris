import React, { useContext } from "react";

import type { GetEnsNameReturnType } from "viem";
import type { GetEnsAvatarReturnType } from "viem/actions";
import type { useConnection } from "wagmi";

import type { useProfile } from "../../hooks/useProfile";

import { abbreviateETHBalance } from "../ConnectButton/abbreviateETHBalance";
import { formatAddress } from "../ConnectButton/formatAddress";
import { formatENS } from "../ConnectButton/formatENS";
import { ShowRecentTransactionsContext } from "../RainbowKitProvider/ShowRecentTransactionsContext";
import { TxList } from "../Txs/TxList";
import { ProfileDetailsView } from "./ProfileDetailsView";

interface ProfileDetailsProps {
  address: ReturnType<typeof useConnection>["address"];
  ensAvatar: GetEnsAvatarReturnType | undefined;
  ensName: GetEnsNameReturnType | undefined;
  balance: ReturnType<typeof useProfile>["balance"];
  onClose: () => void;
  onDisconnect: () => void;
}

export function ProfileDetails({ address, ensAvatar, ensName, balance, onClose, onDisconnect }: ProfileDetailsProps) {
  const showRecentTransactions = useContext(ShowRecentTransactionsContext);

  if (!address) {
    return null;
  }

  const accountName = ensName ? formatENS(ensName) : formatAddress(address);
  const ethBalance = balance?.formatted;
  const displayBalance = ethBalance ? abbreviateETHBalance(Number.parseFloat(ethBalance)) : undefined;

  return (
    <ProfileDetailsView
      accountName={accountName}
      address={address}
      avatarImageUrl={ensAvatar ?? undefined}
      balanceLabel={balance && displayBalance ? `${displayBalance} ${balance.symbol}` : undefined}
      onClose={onClose}
      onDisconnect={onDisconnect}
      transactions={showRecentTransactions ? <TxList address={address} /> : undefined}
    />
  );
}
