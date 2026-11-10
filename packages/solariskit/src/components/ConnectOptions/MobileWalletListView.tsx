import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { ActionButton } from "../Button/ActionButton";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const snakeBorder = stylex.keyframes({
  from: { strokeDashoffset: 0 },
  to: { strokeDashoffset: -283 },
});

const styles = stylex.create({
  spinner: {
    position: "absolute",
  },
  rotatingBorder: {
    animationDuration: "1s",
    animationIterationCount: "infinite",
    animationName: snakeBorder,
    animationTimingFunction: "linear",
    fill: "none",
    strokeDasharray: "98 196",
    strokeLinecap: "round",
    strokeWidth: 4,
  },
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
  itemIcon: {
    alignItems: "center",
    display: "flex",
    height: 64,
    justifyContent: "center",
    position: "relative",
    width: 64,
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
  handle: {
    alignSelf: "center",
    backgroundColor: `color-mix(in srgb, ${colors.modalText} 20%, transparent)`,
    borderRadius: 9999,
    height: 4,
    marginTop: 8,
    width: 36,
  },
  header: {
    padding: 16,
    paddingBottom: 16,
    paddingTop: 16,
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
  divider: {
    backgroundColor: colors.generalBorder,
    height: 1,
    marginBottom: 24,
  },
  intro: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingInline: 24,
    textAlign: "center",
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingInline: 16,
    paddingTop: 20,
  },
  disclaimer: {
    marginInline: 24,
    marginTop: 20,
    textAlign: "center",
  },
});

const LoadingSpinner = ({ accent }: { accent?: string }) => {
  const width = 80;
  const height = 80;
  const radiusFactor = 20;

  const perimeter = 2 * (width + height - 4 * radiusFactor);

  return (
    <svg
      {...stylex.props(styles.spinner)}
      height="70"
      viewBox="0 0 86 86"
      width="70"
    >
      <title>Loading</title>
      <rect
        {...stylex.props(styles.rotatingBorder)}
        height={height}
        rx={radiusFactor}
        ry={radiusFactor}
        strokeDasharray={`${perimeter / 3} ${(2 * perimeter) / 3}`}
        strokeDashoffset={perimeter}
        style={{ stroke: accent || "#0D3887" }}
        width={width}
        x="3"
        y="3"
      />
    </svg>
  );
};

export interface MobileWalletItemViewProps {
  connecting?: boolean;
  iconAccent?: string;
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
  iconAccent,
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
        <span {...stylex.props(styles.itemIcon)}>
          {connecting ? <LoadingSpinner accent={iconAccent} /> : null}
          <AsyncImage
            background={iconBackground}
            radius={16}
            size={56}
            src={iconUrl}
          />
        </span>
        {!connecting ? (
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
                {t("connect.recent")}
              </Text>
            )}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export interface MobileWalletListViewProps {
  error?: string;
  getWalletUrl: string;
  onClose: () => void;
  titleId: string;
  walletItems: ReactNode;
}

/**
 * Chain-agnostic mobile connect sheet: title header, horizontally scrolling
 * wallet row, intro copy, get-wallet/learn-more actions, and the optional
 * disclaimer. The EVM MobileOptions and the Solana connect modal both
 * parameterize this view.
 */
export function MobileWalletListView({
  error,
  getWalletUrl,
  onClose,
  titleId,
  walletItems,
}: MobileWalletListViewProps) {
  const { disclaimer: Disclaimer, learnMoreUrl } = useContext(AppContext);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.handle)} />
      <div {...stylex.props(styles.header)}>
        <DialogHeader
          onClose={onClose}
          title={t("connect.title")}
          titleId={titleId}
        />
      </div>
      <div {...stylex.props(styles.wallets)}>{walletItems}</div>
      {error && (
        <div
          {...stylex.props(styles.error)}
          role="alert"
        >
          <Text
            color="error"
            size="14"
            weight="medium"
          >
            {error}
          </Text>
        </div>
      )}
      <div {...stylex.props(styles.divider)} />
      <div {...stylex.props(styles.intro)}>
        <Text
          color="modalText"
          size="16"
          weight="semibold"
        >
          {t("intro.title")}
        </Text>
        <Text
          color="modalTextSecondary"
          size="14"
          weight="regular"
        >
          {t("intro.description")}
        </Text>
      </div>
      <div {...stylex.props(styles.actions)}>
        <ActionButton
          fullWidth
          href={getWalletUrl}
          label={t("intro.get.label")}
          size="large"
        />
        <TextLink
          href={learnMoreUrl}
          tall
        >
          {t("intro.learn_more.label")}
        </TextLink>
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
