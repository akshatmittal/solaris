import React, { useContext } from "react";

import type { GetEnsNameReturnType } from "viem";
import type { GetEnsAvatarReturnType } from "viem/actions";

import { useConnection } from "wagmi";

import type { useProfile } from "../../hooks/useProfile";

import { abbreviateETHBalance } from "../ConnectButton/abbreviateETHBalance";
import { formatAddress } from "../ConnectButton/formatAddress";
import { formatENS } from "../ConnectButton/formatENS";
import { ShowRecentTransactionsContext } from "../SolarisEthereumProvider/ShowRecentTransactionsContext";
import { TxList } from "../Txs/TxList";
import { ProfileDetailsView } from "./ProfileDetailsView";

interface ProfileDetailsProps {
  address: ReturnType<typeof useConnection>["address"];
  ensAvatar: GetEnsAvatarReturnType | undefined;
  ensName: GetEnsNameReturnType | undefined;
  balance: ReturnType<typeof useProfile>["balance"];
  onClose: () => void;
  onDisconnect: () => void;
  titleId: string;
}

export function ProfileDetails({
  address,
  ensAvatar,
  ensName,
  balance,
  onClose,
  onDisconnect,
  titleId,
}: ProfileDetailsProps) {
  const showRecentTransactions = useContext(ShowRecentTransactionsContext);
  const { chain } = useConnection();
  const blockExplorer = chain?.blockExplorers?.default;

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
      explorer={blockExplorer && { name: blockExplorer.name, url: `${blockExplorer.url}/address/${address}` }}
      onClose={onClose}
      onDisconnect={onDisconnect}
      titleId={titleId}
      transactions={showRecentTransactions ? <TxList /> : undefined}
    />
  );
}
