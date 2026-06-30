import React, { useEffect, useState } from "react";

import { type ResponsiveValue, mapResponsiveValue, normalizeResponsiveValue } from "../../css/sprinkles.css";
import { touchableStyles } from "../../css/touchableStyles";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { t } from "../../translations";
import { isMobile } from "../../utils/isMobile";
import { Avatar } from "../Avatar/Avatar";
import { Box } from "../Box/Box";
import { DropdownIcon } from "../Icons/Dropdown";
import { useShowBalance } from "../RainbowKitProvider/ShowBalanceContext";
import { ConnectButtonRenderer } from "./ConnectButtonRenderer";

type AccountStatus = "full" | "avatar" | "address";

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
        const ready = mounted && connectionStatus !== "loading";

        return (
          <Box
            display="flex"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {ready && account && connectionStatus === "connected" ? (
              <Box
                alignItems="center"
                as="button"
                background="connectButtonBackground"
                borderRadius="connectButton"
                boxShadow="connectButton"
                className={touchableStyles({
                  active: "shrink",
                  hover: "grow",
                })}
                color="connectButtonText"
                display="flex"
                fontFamily="body"
                fontWeight="bold"
                onClick={openAccountModal}
                testId="account-button"
                transition="default"
                type="button"
              >
                {account.displayBalance && (
                  <Box
                    display={mapResponsiveValue(showBalance, (value) => (value ? "block" : "none"))}
                    padding="8"
                    paddingLeft="12"
                  >
                    {account.displayBalance}
                  </Box>
                )}
                <Box
                  background={
                    normalizeResponsiveValue(showBalance)[isMobile() ? "smallScreen" : "largeScreen"]
                      ? "connectButtonInnerBackground"
                      : "connectButtonBackground"
                  }
                  borderColor="connectButtonBackground"
                  borderRadius="connectButton"
                  borderStyle="solid"
                  borderWidth="2"
                  color="connectButtonText"
                  fontFamily="body"
                  fontWeight="bold"
                  paddingX="8"
                  paddingY="6"
                  transition="default"
                >
                  <Box
                    alignItems="center"
                    display="flex"
                    gap="6"
                    height="24"
                  >
                    <Box
                      display={mapResponsiveValue(accountStatus, (value) =>
                        value === "full" || value === "avatar" ? "block" : "none",
                      )}
                    >
                      <Avatar
                        address={account.address}
                        imageUrl={account.ensAvatar}
                        loading={account.hasPendingTransactions}
                        size={24}
                      />
                    </Box>

                    <Box
                      alignItems="center"
                      display="flex"
                      gap="6"
                    >
                      <Box
                        display={mapResponsiveValue(accountStatus, (value) =>
                          value === "full" || value === "address" ? "block" : "none",
                        )}
                      >
                        {account.displayName}
                      </Box>
                      <DropdownIcon />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                as="button"
                background="accentColor"
                borderRadius="connectButton"
                boxShadow="connectButton"
                className={touchableStyles({
                  active: "shrink",
                  hover: "grow",
                })}
                color="accentColorForeground"
                fontFamily="body"
                fontWeight="bold"
                height="40"
                key="connect"
                onClick={openConnectModal}
                paddingX="14"
                testId="connect-button"
                transition="default"
                type="button"
              >
                {mounted && label === "Connect Wallet" ? t("connect_wallet.label") : label}
              </Box>
            )}
          </Box>
        );
      }}
    </ConnectButtonRenderer>
  ) : null;
}

ConnectButton.__defaultProps = defaultProps;
ConnectButton.Custom = ConnectButtonRenderer;
