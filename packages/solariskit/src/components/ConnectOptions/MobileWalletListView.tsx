import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors } from "../../css/vars.stylex";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { SpinnerIcon } from "../Icons/Spinner";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const styles = stylex.create({
  item: {
    alignSelf: "start",
    minWidth: 0,
    overflow: "visible",
    textAlign: "center",
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
  container: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
  },
  header: {
    padding: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  groupLabel: {
    marginBottom: 12,
    paddingInline: 20,
  },
  wallets: {
    display: "grid",
    // Four columns from 375px; narrower screens use a 2-column grid so no wallet hides behind a scroll.
    columnGap: 8,
    gridAutoColumns: "calc((100% - 24px) / 4)",
    gridAutoFlow: { default: "column", "@media (max-width: 374.98px)": "row" },
    gridTemplateColumns: {
      default: "repeat(4, calc((100% - 24px) / 4))",
      "@media (max-width: 374.98px)": "repeat(2, 1fr)",
    },
    overflowX: "auto",
    rowGap: 20,
    paddingBottom: 24,
    paddingInline: 16,
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  error: {
    paddingBottom: 16,
    paddingInline: 20,
  },
  footer: {
    alignItems: "center",
    borderTopColor: colors.generalBorder,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    display: "flex",
    justifyContent: "space-between",
    minHeight: 52,
    paddingBlock: 4,
    paddingInline: 24,
  },
  disclaimer: {
    marginInline: 24,
    marginTop: 20,
    textAlign: "center",
  },
});

export interface MobileWalletItemViewProps {
  connecting?: boolean;
  iconBackground?: string;
  iconUrl: string | (() => Promise<string>);
  id: string;
  name: string;
  onClick: () => void;
  ready?: boolean;
  recent?: boolean;
  shortName?: string;
}

export function MobileWalletItemView({
  connecting,
  iconBackground,
  iconUrl,
  id,
  name,
  onClick,
  ready,
  recent,
  shortName,
}: MobileWalletItemViewProps) {
  return (
    <button
      {...stylex.props(reset.button, styles.item)}
      data-testid={`rk-wallet-option-${id}`}
      disabled={!ready}
      onClick={onClick}
      type="button"
    >
      <span {...stylex.props(styles.itemContent)}>
        <AsyncImage
          background={iconBackground}
          radius={16}
          size={56}
          src={iconUrl}
        />
        {connecting ? (
          <span {...stylex.props(styles.itemSpinner)}>
            <SpinnerIcon />
          </span>
        ) : (
          <span {...stylex.props(styles.itemLabel)}>
            <Text
              as="span"
              color={ready ? "modalText" : "modalTextSecondary"}
              size="13"
              weight="medium"
              xstyle={styles.itemName}
            >
              {shortName ?? name}
              {!ready && " (unsupported)"}
            </Text>
            {recent && (
              <Text
                as="span"
                color="accentColor"
                size="12"
                weight="medium"
              >
                Recent
              </Text>
            )}
          </span>
        )}
      </span>
    </button>
  );
}

export function MobileWalletGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <>
      <Text
        color="modalTextSecondary"
        size="13"
        weight="medium"
        xstyle={styles.groupLabel}
      >
        {label}
      </Text>
      <div {...stylex.props(styles.wallets)}>{children}</div>
    </>
  );
}

export interface MobileWalletListViewProps {
  declined: boolean;
  getWalletUrl: string;
  onClose: () => void;
  titleId: string;
  walletItems: ReactNode;
}

/**
 * Chain-agnostic mobile connect sheet: title header, labelled wallet groups
 * (see MobileWalletGroup), a get-wallet link, and the optional disclaimer. The EVM MobileOptions and the Solana connect modal both
 * parameterize this view.
 */
export function MobileWalletListView({
  declined,
  getWalletUrl,
  onClose,
  titleId,
  walletItems,
}: MobileWalletListViewProps) {
  const { disclaimer: Disclaimer } = useContext(AppContext);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <DialogHeader
          onClose={onClose}
          title="Connect Wallet"
          titleId={titleId}
        />
      </div>
      {walletItems}
      {declined && (
        <div
          {...stylex.props(styles.error)}
          role="alert"
        >
          <Text
            color="error"
            size="14"
            weight="medium"
          >
            Connection declined
          </Text>
        </div>
      )}
      <div {...stylex.props(styles.footer)}>
        <Text
          color="modalTextSecondary"
          size="14"
          weight="regular"
        >
          New to wallets?
        </Text>
        <TextLink href={getWalletUrl}>Get a Wallet</TextLink>
      </div>
      {Disclaimer && (
        <div {...stylex.props(styles.disclaimer)}>
          <Disclaimer
            Link={DisclaimerLink}
            Text={DisclaimerText}
          />
        </div>
      )}
    </div>
  );
}
