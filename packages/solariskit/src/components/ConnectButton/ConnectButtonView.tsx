import React from "react";

import { type ResponsiveValue, mapResponsiveValue, normalizeResponsiveValue } from "../../css/sprinkles.css";
import { touchableStyles } from "../../css/touchableStyles";
import { t } from "../../translations";
import { isMobile } from "../../utils/isMobile";
import { Avatar } from "../Avatar/Avatar";
import { Box } from "../Box/Box";
import { DropdownIcon } from "../Icons/Dropdown";

export type AccountStatus = "full" | "avatar" | "address";

export interface ConnectButtonAccount {
  address: string;
  displayBalance?: string;
  displayName: string;
  ensAvatar?: string;
  hasPendingTransactions: boolean;
}

export interface ConnectButtonViewProps {
  account?: ConnectButtonAccount;
  accountStatus: ResponsiveValue<AccountStatus>;
  buttonReady: boolean;
  isConnected: boolean;
  label: string;
  mounted: boolean;
  onOpenAccountModal: () => void;
  onOpenConnectModal: () => void;
  showBalance: ResponsiveValue<boolean>;
}

export function ConnectButtonView({
  account,
  accountStatus,
  buttonReady,
  isConnected,
  label,
  mounted,
  onOpenAccountModal,
  onOpenConnectModal,
  showBalance,
}: ConnectButtonViewProps) {
  return (
    <Box
      display="flex"
      {...(!buttonReady && {
        "aria-hidden": true,
        style: {
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
        },
      })}
    >
      {buttonReady && account && isConnected ? (
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
          onClick={onOpenAccountModal}
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
          onClick={onOpenConnectModal}
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
}
