import React, { useEffect } from "react";

import type { ResponsiveValue } from "../../css/sprinkles.css";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { useHydrated } from "../../hooks/useHydrated";
import { useShowBalance } from "../RainbowKitProvider/ShowBalanceContext";
import { ConnectButtonRenderer } from "./ConnectButtonRenderer";
import { type AccountStatus, ConnectButtonView, defaultConnectButtonProps } from "./ConnectButtonView";

export interface ConnectButtonProps {
  accountStatus?: ResponsiveValue<AccountStatus>;
  showBalance?: ResponsiveValue<boolean>;
  label?: string;
}

const defaultProps = defaultConnectButtonProps;

export function ConnectButton({
  accountStatus = defaultProps.accountStatus,
  label = defaultProps.label,
  showBalance = defaultProps.showBalance,
}: ConnectButtonProps) {
  const connectionStatus = useConnectionStatus();
  const { setShowBalance } = useShowBalance();
  const hydrated = useHydrated();

  useEffect(() => {
    setShowBalance(showBalance);
  }, [setShowBalance, showBalance]);

  return hydrated ? (
    <ConnectButtonRenderer>
      {({ account, mounted, openAccountModal, openConnectModal }) => {
        const buttonReady = mounted && connectionStatus !== "loading";

        return (
          <ConnectButtonView
            account={account}
            accountStatus={accountStatus}
            buttonReady={buttonReady}
            isConnected={connectionStatus === "connected"}
            label={label}
            mounted={mounted}
            onOpenAccountModal={openAccountModal}
            onOpenConnectModal={openConnectModal}
            showBalance={showBalance}
          />
        );
      }}
    </ConnectButtonRenderer>
  ) : null;
}

ConnectButton.Custom = ConnectButtonRenderer;
