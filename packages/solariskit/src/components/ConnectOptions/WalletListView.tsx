import React, { Fragment } from "react";

import * as stylex from "@stylexjs/stylex";

import { ModalSelection } from "../ModalSelection/ModalSelection";
import { Text } from "../Text/Text";

const styles = stylex.create({
  groupLabel: {
    marginBottom: 6,
    marginTop: { default: 12, ":first-child": 2 },
    paddingInline: 12,
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
  name: string;
  ready?: boolean;
  recent?: boolean;
}

export interface WalletListViewProps {
  groupedWallets: Partial<Record<string, WalletListViewItem[]>>;
  onSelectWallet: (wallet: WalletListViewItem) => void;
  selectedWalletId?: string;
}

export function WalletListView({ groupedWallets, onSelectWallet, selectedWalletId }: WalletListViewProps) {
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
                  xstyle={styles.groupLabel}
                >
                  {groupName}
                </Text>
              ) : null}
              <div {...stylex.props(styles.group)}>
                {wallets.map((wallet) => (
                  <ModalSelection
                    currentlySelected={wallet.id === selectedWalletId}
                    iconBackground={wallet.iconBackground}
                    iconUrl={wallet.iconUrl}
                    key={wallet.id}
                    name={wallet.name}
                    onClick={() => onSelectWallet(wallet)}
                    recent={wallet.recent}
                    testId={`wallet-option-${wallet.id}`}
                    isRainbowKitConnector={wallet.isRainbowKitConnector}
                  />
                ))}
              </div>
            </Fragment>
          ),
      )}
    </>
  );
}
