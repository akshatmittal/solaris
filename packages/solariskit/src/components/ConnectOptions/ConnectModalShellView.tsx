import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, media, motion } from "../../css/vars.stylex";
import { t } from "../../translations";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { IconButton } from "../IconButton/IconButton";
import { BackIcon } from "../Icons/Back";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const styles = stylex.create({
  shell: {
    display: "flex",
    minHeight: 0,
  },
  swap: {
    animationDuration: motion.enter,
    animationName: fadeIn,
    animationTimingFunction: motion.easeOut,
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    flexGrow: 1,
    overflowY: "auto",
    paddingBottom: 12,
    paddingInline: 12,
  },
  error: {
    paddingBottom: 12,
    paddingInline: { default: 20, [media.largeScreen]: 24 },
  },
  footer: {
    alignItems: "center",
    minHeight: 52,
    borderTopColor: colors.generalBorder,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: 4,
    paddingInline: 24,
  },
  footerDisclaimer: {
    justifyContent: "center",
    textAlign: "center",
  },
  pane: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 0,
  },
  paneContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    paddingBottom: 16,
    paddingInline: 24,
    paddingTop: 12,
  },
});

export interface ConnectModalShellViewProps {
  declined?: boolean;
  hideFooter?: boolean;
  getWalletUrl: string;
  onClose: () => void;
  onRightPaneBack?: () => void;
  rightPaneContent: ReactNode;
  rightPaneHeaderLabel?: ReactNode;
  showRightPane: boolean;
  showSidebar: boolean;
  titleId: string;
  walletList: ReactNode;
}

/**
 * Chain-agnostic connect-modal chrome for the desktop and mobile flows: the wallet list with its footer, plus the
 * wallet pane with its back/label/close header. The EVM connect options and the Solana connect modal both
 * parameterize this shell.
 */
export function ConnectModalShellView({
  declined = false,
  getWalletUrl,
  hideFooter = false,
  onClose,
  onRightPaneBack,
  rightPaneContent,
  rightPaneHeaderLabel,
  showRightPane,
  showSidebar,
  titleId,
  walletList,
}: ConnectModalShellViewProps) {
  const { disclaimer: Disclaimer } = useContext(AppContext);

  return (
    <div
      {...stylex.props(styles.shell)}
      style={{ maxHeight: 520 }}
    >
      {showSidebar && (
        <div {...stylex.props(styles.sidebar, styles.swap)}>
          <div {...stylex.props(styles.header)}>
            <DialogHeader
              onClose={onClose}
              testId="connect-header-label"
              title={t("connect.title")}
              titleId={titleId}
            />
          </div>
          <div {...stylex.props(styles.list, reset.scrollbar)}>{walletList}</div>
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
                {t("connect.status.declined")}
              </Text>
            </div>
          )}
          {!hideFooter &&
            (Disclaimer ? (
              <div {...stylex.props(styles.footer, styles.footerDisclaimer)}>
                <Disclaimer
                  Link={DisclaimerLink}
                  Text={DisclaimerText}
                />
              </div>
            ) : (
              <div {...stylex.props(styles.footer)}>
                <Text
                  color="modalTextSecondary"
                  size="14"
                  weight="regular"
                >
                  {t("connect.new_to_ethereum.description")}
                </Text>
                <TextLink href={getWalletUrl}>{t("intro.get.label")}</TextLink>
              </div>
            ))}
        </div>
      )}
      {showRightPane && (
        <div {...stylex.props(styles.pane, styles.swap)}>
          <div {...stylex.props(styles.header)}>
            <DialogHeader
              left={
                onRightPaneBack && (
                  <IconButton
                    aria-label={t("common.back")}
                    onClick={onRightPaneBack}
                  >
                    <BackIcon />
                  </IconButton>
                )
              }
              onClose={onClose}
              title={rightPaneHeaderLabel}
              titleId={showSidebar ? undefined : titleId}
            />
          </div>
          <div {...stylex.props(styles.paneContent)}>{rightPaneContent}</div>
        </div>
      )}
    </div>
  );
}
