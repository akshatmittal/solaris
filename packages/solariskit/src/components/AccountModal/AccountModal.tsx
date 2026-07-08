import React from "react";

import { useConnection, useDisconnect } from "wagmi";

import { useProfile } from "../../hooks/useProfile";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { ProfileDetails } from "../ProfileDetails/ProfileDetails";

export interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountModal({ onClose, open }: AccountModalProps) {
  const { address } = useConnection();
  const { balance, ensAvatar, ensName } = useProfile({
    address,
    includeBalance: open,
  });
  const { mutate: disconnect } = useDisconnect();
  // Unique per instance so the Dialog's aria-labelledby resolves to THIS
  // modal's heading even when several ecosystems mount account modals.
  const titleId = `rk_account_modal_title_${React.useId()}`;

  if (!address) {
    return null;
  }

  return (
    <>
      {address && (
        <Dialog
          onClose={onClose}
          open={open}
          titleId={titleId}
        >
          <DialogContent
            bottomSheetOnMobile
            padding="0"
          >
            <ProfileDetails
              address={address}
              ensAvatar={ensAvatar}
              ensName={ensName}
              balance={balance}
              onClose={onClose}
              onDisconnect={disconnect}
              titleId={titleId}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
