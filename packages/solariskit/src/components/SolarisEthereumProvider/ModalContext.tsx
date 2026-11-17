import React, { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useConfig, useConnectionEffect } from "wagmi";

import type { SolarisChain } from "./SolarisChainContext";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { AccountModal } from "../AccountModal/AccountModal";
import { ChainModal } from "../ChainModal/ChainModal";
import { ConnectModal } from "../ConnectModal/ConnectModal";
import { useAuthenticationStatus } from "./AuthenticationContext";

export interface ChainModalOptions {
  /** Lists only the chains this returns `true` for, until the modal opens again. */
  filter?: (chain: SolarisChain) => boolean;
}

export function useModalStateValue() {
  const [isModalOpen, setModalOpen] = useState(false);

  return {
    closeModal: useCallback(() => setModalOpen(false), []),
    isModalOpen,
    openModal: useCallback(() => setModalOpen(true), []),
  };
}

interface ModalContextValue {
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  connectModalOpen: boolean;
  openAccountModal?: () => void;
  // The zero-argument overload keeps `onClick={openChainModal}` type-checking.
  openChainModal?: {
    (): void;
    (options: ChainModalOptions): void;
  };
  openConnectModal?: () => void;
  isWalletConnectModalOpen: boolean;
  setIsWalletConnectModalOpen: (isWalletConnectModalOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextValue>({
  accountModalOpen: false,
  chainModalOpen: false,
  connectModalOpen: false,
  isWalletConnectModalOpen: false,
  setIsWalletConnectModalOpen: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const {
    closeModal: closeConnectModal,
    isModalOpen: connectModalOpen,
    openModal: openConnectModal,
  } = useModalStateValue();

  const {
    closeModal: closeAccountModal,
    isModalOpen: accountModalOpen,
    openModal: openAccountModal,
  } = useModalStateValue();

  const { closeModal: closeChainModal, isModalOpen: chainModalOpen, openModal: openChainModal } = useModalStateValue();
  const [chainModalFilter, setChainModalFilter] = useState<ChainModalOptions["filter"]>();

  // The filter stays set after close so the list does not change during the exit animation.
  const openChainModalWithOptions = useCallback(
    (options?: ChainModalOptions) => {
      setChainModalFilter(() => options?.filter);
      openChainModal();
    },
    [openChainModal],
  );

  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = useState(false);

  const connectionStatus = useConnectionStatus();

  const { chains } = useConfig();

  interface CloseModalsOptions {
    keepConnectModalOpen?: boolean;
  }

  const closeModals = useCallback(
    ({ keepConnectModalOpen = false }: CloseModalsOptions = {}) => {
      if (!keepConnectModalOpen) {
        closeConnectModal();
      }
      closeAccountModal();
      closeChainModal();
    },
    [closeConnectModal, closeAccountModal, closeChainModal],
  );

  const isUnauthenticated = useAuthenticationStatus() === "unauthenticated";

  useConnectionEffect({
    onConnect: () => {
      closeModals({ keepConnectModalOpen: isUnauthenticated });
      if (isUnauthenticated && isWalletConnectModalOpen) {
        openConnectModal();
      }
    },
    onDisconnect: () => closeModals(),
  });

  useEffect(() => {
    // Due to multiple connection feature in wagmi v2 we need to close
    // modals when user is unauthenticated. When connectors changes we log user out
    // This means we'll need to close the modals as well.
    if (isUnauthenticated) closeModals();
  }, [isUnauthenticated, closeModals]);

  return (
    <ModalContext.Provider
      value={useMemo(
        () => ({
          accountModalOpen,
          chainModalOpen,
          connectModalOpen,
          isWalletConnectModalOpen,
          openAccountModal: connectionStatus === "connected" ? openAccountModal : undefined,
          openChainModal: chains.length > 0 ? openChainModalWithOptions : undefined,
          openConnectModal:
            connectionStatus === "disconnected" || connectionStatus === "unauthenticated"
              ? openConnectModal
              : undefined,
          setIsWalletConnectModalOpen,
        }),
        [
          connectionStatus,
          accountModalOpen,
          chainModalOpen,
          connectModalOpen,
          openAccountModal,
          openChainModalWithOptions,
          openConnectModal,
          chains.length,
          isWalletConnectModalOpen,
        ],
      )}
    >
      {children}
      <ConnectModal
        onClose={closeConnectModal}
        open={connectModalOpen}
      />
      <AccountModal
        onClose={closeAccountModal}
        open={accountModalOpen}
      />
      <ChainModal
        filter={chainModalFilter}
        onClose={closeChainModal}
        open={chainModalOpen}
      />
    </ModalContext.Provider>
  );
}

export function useModalState() {
  const { accountModalOpen, chainModalOpen, connectModalOpen } = useContext(ModalContext);

  return {
    accountModalOpen,
    chainModalOpen,
    connectModalOpen,
  };
}

export function useAccountModal() {
  const { accountModalOpen, openAccountModal } = useContext(ModalContext);
  return { accountModalOpen, openAccountModal };
}

export function useChainModal() {
  const { chainModalOpen, openChainModal } = useContext(ModalContext);
  return { chainModalOpen, openChainModal };
}

export function useWalletConnectOpenState() {
  const { isWalletConnectModalOpen, setIsWalletConnectModalOpen } = useContext(ModalContext);

  return { isWalletConnectModalOpen, setIsWalletConnectModalOpen };
}

export function useConnectModal() {
  const { connectModalOpen, openConnectModal } = useContext(ModalContext);
  const { isWalletConnectModalOpen } = useWalletConnectOpenState();

  return {
    connectModalOpen: connectModalOpen || isWalletConnectModalOpen,
    openConnectModal,
  };
}
