import React from "react";

import { formatAddress } from "../../../components/ConnectButton/formatAddress";
import { Dialog } from "../../../components/Dialog/Dialog";
import { DialogContent } from "../../../components/Dialog/DialogContent";
import { ProfileDetailsView } from "../../../components/ProfileDetails/ProfileDetailsView";
import { useSolanaBalance, useSolanaDisconnectWallet, useSolanaWallet } from "../../hooks";

export interface SolanaAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function SolanaAccountModal({ onClose, open }: SolanaAccountModalProps) {
  const wallet = useSolanaWallet();
  const { disconnect } = useSolanaDisconnectWallet();
  const { formattedSol } = useSolanaBalance({ enabled: open && wallet.isConnected });

  if (!wallet.account) {
    return null;
  }

  const titleId = "rk_account_modal_title";

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent
        bottomSheetOnMobile
        padding="0"
      >
        <ProfileDetailsView
          accountName={formatAddress(wallet.account)}
          address={wallet.account}
          balanceLabel={formattedSol}
          onClose={onClose}
          onDisconnect={() => {
            void disconnect();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
