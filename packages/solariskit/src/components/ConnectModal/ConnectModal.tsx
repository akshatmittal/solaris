import React from "react";

import { useConnection, useDisconnect } from "wagmi";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import ConnectOptions from "../ConnectOptions/ConnectOptions";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { SignIn } from "../SignIn/SignIn";

export interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConnectModal({ onClose, open }: ConnectModalProps) {
  // Unique per instance so two connect modals (e.g. EVM + Solana islands)
  // never share a DOM id for their aria-labelledby headings.
  const titleId = `solaris_connect_title_${React.useId()}`;
  const connectionStatus = useConnectionStatus();

  const { mutate: disconnect } = useDisconnect();
  const { isConnecting } = useConnection();

  // when a user cancels or dismisses the SignIn modal for SIWE, disconnect and call onClose
  const onAuthCancel = React.useCallback(() => {
    onClose();
    disconnect();
  }, [onClose, disconnect]);

  const onConnectModalCancel = React.useCallback(() => {
    // We use this for the WalletButton. If the QR code shows up and
    // the user closes it, we need to know the wallet isn't connecting anymore.
    // So if it's connecting, we disconnect it.
    if (isConnecting) disconnect();

    onClose();
  }, [onClose, disconnect, isConnecting]);

  // One Dialog for every status, so it can animate out after the wallet connects.
  const authenticating = connectionStatus === "unauthenticated";

  return (
    <Dialog
      onClose={authenticating ? onAuthCancel : onConnectModalCancel}
      open={open && (connectionStatus === "disconnected" || authenticating)}
      titleId={titleId}
    >
      <DialogContent view={authenticating ? "sign-in" : "connect"}>
        {authenticating ? (
          <SignIn
            onClose={onAuthCancel}
            onCloseModal={onClose}
            titleId={titleId}
          />
        ) : (
          <ConnectOptions
            onClose={onConnectModalCancel}
            titleId={titleId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
