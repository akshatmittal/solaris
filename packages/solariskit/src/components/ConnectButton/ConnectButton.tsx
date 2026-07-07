import React, { useEffect, useState } from "react";

import type { ResponsiveValue } from "../../css/sprinkles.css";

import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { useShowBalance } from "../RainbowKitProvider/ShowBalanceContext";
import { ConnectButtonRenderer } from "./ConnectButtonRenderer";
import { type AccountStatus, ConnectButtonView } from "./ConnectButtonView";

export interface ConnectButtonProps {
  accountStatus?: ResponsiveValue<AccountStatus>;
  showBalance?: ResponsiveValue<boolean>;
  label?: string;
}

const defaultProps = {
  accountStatus: "full",
  label: "Connect Wallet",
  showBalance: { largeScreen: true, smallScreen: false },
} as const;

export function ConnectButton({
  accountStatus = defaultProps.accountStatus,
  label = defaultProps.label,
  showBalance = defaultProps.showBalance,
}: ConnectButtonProps) {
  const connectionStatus = useConnectionStatus();
  const { setShowBalance } = useShowBalance();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setShowBalance(showBalance);
    if (!ready) setReady(true);
  }, [ready, setShowBalance, showBalance]);

  return ready ? (
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

ConnectButton.__defaultProps = defaultProps;
ConnectButton.Custom = ConnectButtonRenderer;
