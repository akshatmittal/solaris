import React from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { type ResponsiveValue, responsiveDisplay } from "../../css/responsive";
import { colors, fonts, motion, radii, shadows } from "../../css/vars.stylex";
import { t } from "../../translations";
import { Avatar } from "../Avatar/Avatar";
import { DropdownIcon } from "../Icons/Dropdown";

export const triggerStyles = stylex.create({
  button: {
    alignItems: "center",
    borderRadius: radii.connectButton,
    boxShadow: shadows.connectButton,
    display: "flex",
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 600,
    height: 40,
    lineHeight: "20px",
    transitionDuration: motion.fast,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease-out",
    whiteSpace: "nowrap",
    WebkitFontSmoothing: "antialiased",
  },
  hidden: {
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none",
  },
  // Centers the letters, not the font's line box, so every font lines up with the 24px icons.
  label: {
    textBox: "trim-both cap alphabetic",
  },
});

const pulse = stylex.keyframes({
  "50%": { opacity: 0.5 },
});

const styles = stylex.create({
  wrapper: { display: "flex" },
  connect: {
    backgroundColor: { default: colors.accentColor, ":hover": colors.accentHover },
    boxShadow: "none",
    color: colors.accentColorForeground,
    paddingInline: 16,
  },
  account: {
    backgroundColor: { default: colors.connectButtonBackground, ":hover": colors.connectButtonHover },
    color: colors.connectButtonText,
    gap: 4,
    padding: 4,
  },
  // The divider belongs to the balance, so it hides with it at every screen size.
  balance: {
    fontWeight: 500,
    paddingLeft: 8,
    paddingRight: 10,
    position: "relative",
    "::after": {
      backgroundColor: `color-mix(in srgb, ${colors.connectButtonText} 12%, transparent)`,
      content: '""',
      height: 32,
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: 1,
    },
  },
  balanceLoader: {
    animationDuration: motion.spin,
    animationIterationCount: "infinite",
    animationName: { default: pulse, "@media (prefers-reduced-motion: reduce)": "none" },
    backgroundColor: `color-mix(in srgb, ${colors.connectButtonText} 12%, transparent)`,
    borderRadius: 6,
    display: "block",
    height: 12,
    width: 56,
  },
  pill: {
    alignItems: "center",
    borderRadius: `max(0px, calc(${radii.connectButton} - 4px))`,
    display: "flex",
    gap: 8,
    height: 32,
    paddingInline: 6,
  },
});

export type AccountStatus = "full" | "avatar" | "address";

export const defaultConnectButtonProps = {
  accountStatus: "full",
  label: "Connect Wallet",
  showBalance: { largeScreen: true, smallScreen: false },
} as const;

export interface ConnectButtonAccount {
  address: string;
  displayBalance?: string;
  displayName: string;
  ensAvatar?: string;
  hasPendingTransactions: boolean;
  isBalanceLoading: boolean;
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
  /** Distinguishes testIds when multiple ecosystems render this view on one page. */
  testIdPrefix?: string;
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
  testIdPrefix = "",
}: ConnectButtonViewProps) {
  const hasBalance = Boolean(account?.displayBalance) || Boolean(account?.isBalanceLoading);

  return (
    <div
      {...stylex.props(styles.wrapper, !buttonReady && triggerStyles.hidden)}
      aria-hidden={!buttonReady || undefined}
    >
      {buttonReady && account && isConnected ? (
        <button
          {...stylex.props(reset.button, triggerStyles.button, styles.account)}
          data-testid={`rk-${testIdPrefix}account-button`}
          onClick={onOpenAccountModal}
          title={account.hasPendingTransactions ? t("connect_wallet.pending") : undefined}
          type="button"
        >
          {hasBalance && (
            <span
              {...stylex.props(styles.balance, triggerStyles.label, responsiveDisplay(showBalance, Boolean, "block"))}
            >
              {account.displayBalance ?? <span {...stylex.props(styles.balanceLoader)} />}
            </span>
          )}
          <span {...stylex.props(styles.pill)}>
            <span
              {...stylex.props(
                responsiveDisplay(accountStatus, (value) => value === "full" || value === "avatar", "block"),
              )}
            >
              <Avatar
                address={account.address}
                imageUrl={account.ensAvatar}
                loading={account.hasPendingTransactions}
                size={24}
              />
            </span>
            <span
              {...stylex.props(
                triggerStyles.label,
                responsiveDisplay(accountStatus, (value) => value === "full" || value === "address", "block"),
              )}
            >
              {account.displayName}
            </span>
            <DropdownIcon />
          </span>
        </button>
      ) : (
        <button
          {...stylex.props(reset.button, triggerStyles.button, styles.connect)}
          data-testid={`rk-${testIdPrefix}connect-button`}
          key="connect"
          onClick={onOpenConnectModal}
          type="button"
        >
          {mounted && label === "Connect Wallet" ? t("connect_wallet.label") : label}
        </button>
      )}
    </div>
  );
}
