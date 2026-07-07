import React, { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo } from "react";

import { useModalStateValue } from "../../../components/RainbowKitProvider/ModalContext";
import { useSolanaCluster, useSolanaWallet } from "../../hooks";
import { SolanaAccountModal } from "../SolanaAccountModal/SolanaAccountModal";
import { SolanaChainModal } from "../SolanaChainModal/SolanaChainModal";
import { SolanaConnectModal } from "../SolanaConnectModal/SolanaConnectModal";

interface SolanaModalContextValue {
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  connectModalOpen: boolean;
  openAccountModal?: () => void;
  openChainModal?: () => void;
  openConnectModal?: () => void;
}

const SolanaModalContext = createContext<SolanaModalContextValue>({
  accountModalOpen: false,
  chainModalOpen: false,
  connectModalOpen: false,
});

export function SolanaModalProvider({ children }: { children: ReactNode }) {
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
  const wallet = useSolanaWallet();
  const { clusters } = useSolanaCluster();

  const closeModals = useCallback(() => {
    closeConnectModal();
    closeAccountModal();
    closeChainModal();
  }, [closeAccountModal, closeChainModal, closeConnectModal]);

  useEffect(() => {
    if (wallet.isConnected) {
      closeConnectModal();
      return;
    }

    closeAccountModal();
  }, [closeAccountModal, closeConnectModal, wallet.isConnected]);

  useEffect(() => {
    if (wallet.status === "disconnected") {
      closeModals();
    }
  }, [closeModals, wallet.status]);

  return (
    <SolanaModalContext.Provider
      value={useMemo(
        () => ({
          accountModalOpen,
          chainModalOpen,
          connectModalOpen,
          openAccountModal: wallet.isConnected ? openAccountModal : undefined,
          openChainModal: clusters.length > 1 ? openChainModal : undefined,
          openConnectModal: !wallet.isConnected ? openConnectModal : undefined,
        }),
        [
          accountModalOpen,
          chainModalOpen,
          clusters.length,
          connectModalOpen,
          openAccountModal,
          openChainModal,
          openConnectModal,
          wallet.isConnected,
        ],
      )}
    >
      {children}
      <SolanaConnectModal
        onClose={closeConnectModal}
        open={connectModalOpen}
      />
      <SolanaAccountModal
        onClose={closeAccountModal}
        open={accountModalOpen}
      />
      <SolanaChainModal
        onClose={closeChainModal}
        open={chainModalOpen}
      />
    </SolanaModalContext.Provider>
  );
}

export function useSolanaAccountModal() {
  const { accountModalOpen, openAccountModal } = useContext(SolanaModalContext);
  return { accountModalOpen, openAccountModal };
}

export function useSolanaChainModal() {
  const { chainModalOpen, openChainModal } = useContext(SolanaModalContext);
  return { chainModalOpen, openChainModal };
}

export function useSolanaConnectModal() {
  const { connectModalOpen, openConnectModal } = useContext(SolanaModalContext);
  return { connectModalOpen, openConnectModal };
}
