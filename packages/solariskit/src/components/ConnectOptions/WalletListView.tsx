import React, { Fragment } from "react";

import { t } from "../../translations";
import { Box } from "../Box/Box";
import { ModalSelection } from "../ModalSelection/ModalSelection";
import { Text } from "../Text/Text";

export interface WalletListViewItem {
  groupName: string;
  iconBackground?: string;
  iconUrl: string | (() => Promise<string>);
  id: string;
  isRainbowKitConnector?: boolean;
  name: string;
  ready?: boolean;
  recent?: boolean;
}

export interface WalletListViewProps {
  groupedWallets: Record<string, WalletListViewItem[]>;
  onSelectWallet: (wallet: WalletListViewItem) => void;
  selectedWalletId?: string;
}

const supportedGroupNames = ["Recommended", "Other", "Popular", "More", "Others", "Installed"];

export function WalletListView({ groupedWallets, onSelectWallet, selectedWalletId }: WalletListViewProps) {
  return (
    <>
      {Object.entries(groupedWallets).map(
        ([groupName, wallets]) =>
          wallets.length > 0 && (
            <Fragment key={groupName}>
              {groupName ? (
                <Box
                  marginBottom="8"
                  marginTop="16"
                  marginX="6"
                >
                  <Text
                    color={groupName === "Installed" ? "accentColor" : "modalTextSecondary"}
                    size="14"
                    weight="bold"
                  >
                    {supportedGroupNames.includes(groupName)
                      ? t(`connector_group.${groupName.toLowerCase()}`)
                      : groupName}
                  </Text>
                </Box>
              ) : null}
              <Box
                display="flex"
                flexDirection="column"
                gap="4"
              >
                {wallets.map((wallet) => (
                  <ModalSelection
                    currentlySelected={wallet.id === selectedWalletId}
                    iconBackground={wallet.iconBackground}
                    iconUrl={wallet.iconUrl}
                    key={wallet.id}
                    name={wallet.name}
                    onClick={() => onSelectWallet(wallet)}
                    ready={wallet.ready}
                    recent={wallet.recent}
                    testId={`wallet-option-${wallet.id}`}
                    isRainbowKitConnector={wallet.isRainbowKitConnector}
                  />
                ))}
              </Box>
            </Fragment>
          ),
      )}
    </>
  );
}
