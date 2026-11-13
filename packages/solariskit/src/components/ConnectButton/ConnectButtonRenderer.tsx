import React, { type ReactNode, useContext } from "react";

import { useConnection, useConfig } from "wagmi";

import { useHydrated } from "../../hooks/useHydrated";
import { useProfile } from "../../hooks/useProfile";
import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { useRecentTransactions } from "../../transactions/useRecentTransactions";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { type AuthenticationStatus, useAuthenticationStatus } from "../SolarisEthereumProvider/AuthenticationContext";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
  useModalState,
} from "../SolarisEthereumProvider/ModalContext";
import { useShowBalance } from "../SolarisEthereumProvider/ShowBalanceContext";
import { ShowRecentTransactionsContext } from "../SolarisEthereumProvider/ShowRecentTransactionsContext";
import { useSolarisChainsById } from "../SolarisEthereumProvider/SolarisChainContext";
import { abbreviateETHBalance } from "./abbreviateETHBalance";
import { formatAddress } from "./formatAddress";
import { formatENS } from "./formatENS";
import { resolveShowBalance } from "./resolveShowBalance";

const noop = () => {};

export interface ConnectButtonRendererProps {
  children: (renderProps: {
    account?: {
      address: string;
      balanceDecimals?: number;
      balanceFormatted?: string;
      balanceSymbol?: string;
      displayBalance?: string;
      displayName: string;
      ensAvatar?: string;
      ensName?: string;
      hasPendingTransactions: boolean;
      isBalanceLoading: boolean;
    };
    chain?: {
      hasIcon: boolean;
      iconUrl?: string;
      iconBackground?: string;
      id: number;
      name?: string;
      unsupported?: boolean;
    };
    mounted: boolean;
    authenticationStatus?: AuthenticationStatus;
    openAccountModal: () => void;
    openChainModal: () => void;
    openConnectModal: () => void;
    accountModalOpen: boolean;
    chainModalOpen: boolean;
    connectModalOpen: boolean;
  }) => ReactNode;
}

export function ConnectButtonRenderer({ children }: ConnectButtonRendererProps) {
  const hydrated = useHydrated();
  const { address, chainId: connectedChainId } = useConnection();
  const chainId = useSelectedChainId(connectedChainId);
  const { chains: wagmiChains } = useConfig();
  const isConnectedChainSupported = connectedChainId ? isChainIdSupported(wagmiChains, connectedChainId) : true;

  const solarisChainsById = useSolarisChainsById();
  const authenticationStatus = useAuthenticationStatus() ?? undefined;
  const solarisChain = chainId ? solarisChainsById[chainId] : undefined;
  const chainName = solarisChain?.name ?? undefined;
  const chainIconUrl = solarisChain?.iconUrl ?? undefined;
  const chainIconBackground = solarisChain?.iconBackground ?? undefined;
  const resolvedChainIconUrl = useAsyncImage(chainIconUrl);

  const showRecentTransactions = useContext(ShowRecentTransactionsContext);
  const hasPendingTransactions =
    useRecentTransactions().some(({ status }) => status === "pending") && showRecentTransactions;

  const { showBalance } = useShowBalance();

  const shouldShowBalance = resolveShowBalance(showBalance);

  const { balance, ensAvatar, ensName, isBalanceLoading } = useProfile({
    address,
    includeBalance: shouldShowBalance,
  });

  const displayBalance = balance
    ? `${abbreviateETHBalance(Number.parseFloat(balance.formatted))} ${balance.symbol}`
    : undefined;

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { accountModalOpen, chainModalOpen, connectModalOpen } = useModalState();

  return (
    <>
      {children({
        account: address
          ? {
              address,
              balanceDecimals: balance?.decimals,
              balanceFormatted: balance?.formatted,
              balanceSymbol: balance?.symbol,
              displayBalance,
              displayName: ensName ? formatENS(ensName) : formatAddress(address),
              ensAvatar: ensAvatar ?? undefined,
              ensName: ensName ?? undefined,
              hasPendingTransactions,
              isBalanceLoading,
            }
          : undefined,
        accountModalOpen,
        authenticationStatus,
        chain: chainId
          ? {
              hasIcon: Boolean(chainIconUrl),
              iconBackground: chainIconBackground,
              iconUrl: resolvedChainIconUrl,
              id: chainId,
              name: chainName,
              unsupported: !isConnectedChainSupported,
            }
          : undefined,
        chainModalOpen,
        connectModalOpen,
        mounted: hydrated,
        openAccountModal: openAccountModal ?? noop,
        openChainModal: openChainModal ?? noop,
        openConnectModal: openConnectModal ?? noop,
      })}
    </>
  );
}

ConnectButtonRenderer.displayName = "ConnectButton.Custom";
