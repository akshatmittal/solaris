import React from "react";

import * as stylex from "@stylexjs/stylex";

import type { WalletListViewItem } from "./WalletListView";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { SpinnerIcon } from "../Icons/Spinner";
import { Text } from "../Text/Text";

const styles = stylex.create({
  item: {
    alignSelf: "start",
    minWidth: 0,
    overflow: "visible",
    textAlign: "center",
  },
  itemDisabled: {
    pointerEvents: "none",
  },
  itemContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  itemSpinner: {
    color: colors.accentColor,
    display: "flex",
    height: 20,
  },
  // Labels may use half of each 8px grid gap, so names like "WalletConnect" stay on one line.
  itemLabel: {
    display: "flex",
    flexDirection: "column",
    marginInline: -4,
    width: "calc(100% + 8px)",
  },
  itemName: {
    display: "-webkit-box",
    letterSpacing: "-0.02em",
    overflow: "hidden",
    textWrap: "balance",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
  wallets: {
    display: "grid",
    // As many columns as fit: 3 at 320px, 4 on most phones, up to 8 just below the dialog breakpoint.
    columnGap: 8,
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    rowGap: 20,
    paddingBottom: 24,
    paddingInline: 4,
  },
});

function WalletGridItem({
  connecting,
  onClick,
  wallet,
}: {
  connecting: boolean;
  onClick: () => void;
  wallet: WalletListViewItem;
}) {
  return (
    <button
      {...stylex.props(reset.button, styles.item, wallet.loading && styles.itemDisabled, press.scale)}
      aria-busy={connecting || wallet.loading || undefined}
      // The spinner replaces the name.
      aria-label={connecting || wallet.loading ? wallet.name : undefined}
      data-testid={`rk-wallet-option-${wallet.id}`}
      disabled={wallet.loading}
      onClick={onClick}
      type="button"
    >
      <span {...stylex.props(styles.itemContent)}>
        <AsyncImage
          background={wallet.iconBackground}
          radius={16}
          size={56}
          src={wallet.iconUrl}
        />
        {connecting || wallet.loading ? (
          <span {...stylex.props(styles.itemSpinner)}>
            <SpinnerIcon />
          </span>
        ) : (
          <span {...stylex.props(styles.itemLabel)}>
            <Text
              as="span"
              color="modalText"
              size="13"
              weight="medium"
              xstyle={styles.itemName}
            >
              {wallet.shortName ?? wallet.name}
            </Text>
            {wallet.recent && (
              <Text
                as="span"
                color="accentColor"
                size="12"
                weight="medium"
              >
                {t("connect.recent")}
              </Text>
            )}
          </span>
        )}
      </span>
    </button>
  );
}

export function WalletGrid({
  connectingWalletId,
  onSelectWallet,
  wallets,
}: {
  connectingWalletId?: string;
  onSelectWallet: (wallet: WalletListViewItem) => void;
  wallets: WalletListViewItem[];
}) {
  return (
    <div {...stylex.props(styles.wallets)}>
      {wallets.map((wallet) => (
        <WalletGridItem
          connecting={wallet.id === connectingWalletId}
          key={wallet.id}
          onClick={() => onSelectWallet(wallet)}
          wallet={wallet}
        />
      ))}
    </div>
  );
}
