import React, { Fragment } from "react";

import * as stylex from "@stylexjs/stylex";

import { useLargeScreen } from "../../hooks/useLargeScreen";
import { t } from "../../translations";
import { ModalSelection } from "../ModalSelection/ModalSelection";
import { Text } from "../Text/Text";
import { WalletGrid } from "./WalletGrid";

const styles = stylex.create({
  groupLabel: {
    marginBottom: 6,
    marginTop: { default: 12, ":first-child": 2 },
    paddingInline: 12,
  },
  gridLabel: {
    marginBottom: 12,
    marginTop: 0,
    paddingInline: 8,
  },
  group: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
});

export interface WalletListViewItem {
  groupName: string;
  iconBackground?: string;
  iconUrl: string | (() => Promise<string>);
  id: string;
  isRainbowKitConnector?: boolean;
  loading: boolean;
  name: string;
  ready?: boolean;
  recent?: boolean;
  shortName?: string;
}

export interface WalletListViewProps {
  // Shows a spinner on the wallet in the grid; the list marks it with selectedWalletId.
  connectingWalletId?: string;
  groupedWallets: Partial<Record<string, WalletListViewItem[]>>;
  onSelectWallet: (wallet: WalletListViewItem) => void;
  selectedWalletId?: string;
}

const supportedGroupNames = ["Recommended", "Other", "Popular", "More", "Others", "Installed"];

export const groupLabel = (groupName: string) =>
  supportedGroupNames.includes(groupName) ? t(`connector_group.${groupName.toLowerCase()}`) : groupName;

// Small screens show the wallets as a grid of tiles and large screens as a list, whatever the connect flow.
export function WalletListView({
  connectingWalletId,
  groupedWallets,
  onSelectWallet,
  selectedWalletId,
}: WalletListViewProps) {
  const largeScreen = useLargeScreen();

  return (
    <>
      {Object.entries(groupedWallets).map(
        ([groupName, wallets]) =>
          wallets &&
          wallets.length > 0 && (
            <Fragment key={groupName}>
              {groupName ? (
                <Text
                  color="modalTextSecondary"
                  size="13"
                  weight="medium"
                  xstyle={[styles.groupLabel, !largeScreen && styles.gridLabel]}
                >
                  {groupLabel(groupName)}
                </Text>
              ) : null}
              {largeScreen ? (
                <div {...stylex.props(styles.group)}>
                  {wallets.map((wallet) => (
                    <ModalSelection
                      currentlySelected={wallet.id === selectedWalletId}
                      iconBackground={wallet.iconBackground}
                      iconUrl={wallet.iconUrl}
                      key={wallet.id}
                      loading={wallet.loading}
                      name={wallet.name}
                      onClick={() => onSelectWallet(wallet)}
                      recent={wallet.recent}
                      testId={`wallet-option-${wallet.id}`}
                      isRainbowKitConnector={wallet.isRainbowKitConnector}
                    />
                  ))}
                </div>
              ) : (
                <WalletGrid
                  connectingWalletId={connectingWalletId}
                  onSelectWallet={onSelectWallet}
                  wallets={wallets}
                />
              )}
            </Fragment>
          ),
      )}
    </>
  );
}
