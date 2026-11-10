import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { IconButton } from "../IconButton/IconButton";
import { BackIcon } from "../Icons/Back";
import { InfoIcon } from "../Icons/Info";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const styles = stylex.create({
  shell: {
    display: "flex",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    width: 280,
  },
  sidebarCompact: {
    width: "100%",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerStart: {
    paddingLeft: 24,
  },
  list: {
    flexGrow: 1,
    overflowY: "auto",
    paddingBottom: 12,
    paddingInline: 12,
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
    borderLeftColor: colors.generalBorder,
    borderLeftStyle: "solid",
    borderLeftWidth: 1,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 0,
  },
  paneCompact: {
    borderLeftWidth: 0,
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
  compactModeEnabled: boolean;
  hideFooter?: boolean;
  onClose: () => void;
  onCompactInfoClick: () => void;
  onRightPaneBack?: () => void;
  rightPaneContent: ReactNode;
  rightPaneHeaderLabel?: ReactNode;
  showRightPane: boolean;
  showSidebar: boolean;
  titleId: string;
  walletList: ReactNode;
}

/**
 * Chain-agnostic desktop connect-modal chrome: the wallet-list sidebar
 * (with compact-mode footer) plus the right-hand pane with its back/label/close
 * header. The EVM DesktopOptions and the Solana connect modal both
 * parameterize this shell.
 */
export function ConnectModalShellView({
  compactModeEnabled,
  hideFooter = false,
  onClose,
  onCompactInfoClick,
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
      style={{ maxHeight: compactModeEnabled ? 520 : 480 }}
    >
      {showSidebar && (
        <div {...stylex.props(styles.sidebar, compactModeEnabled && styles.sidebarCompact)}>
          <div {...stylex.props(styles.header, !compactModeEnabled && styles.headerStart)}>
            <DialogHeader
              align={compactModeEnabled ? "center" : "start"}
              size={compactModeEnabled ? "18" : "17"}
              left={
                compactModeEnabled &&
                Disclaimer && (
                  <IconButton
                    aria-label="Info"
                    onClick={onCompactInfoClick}
                  >
                    <InfoIcon />
                  </IconButton>
                )
              }
              onClose={compactModeEnabled ? onClose : undefined}
              testId="connect-header-label"
              title={t("connect.title")}
              titleId={titleId}
            />
          </div>
          <div {...stylex.props(styles.list)}>{walletList}</div>
          {compactModeEnabled &&
            !hideFooter &&
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
                <TextLink onClick={onCompactInfoClick}>{t("connect.new_to_ethereum.learn_more.label")}</TextLink>
              </div>
            ))}
        </div>
      )}
      {showRightPane && (
        <div {...stylex.props(styles.pane, compactModeEnabled && styles.paneCompact)}>
          <div {...stylex.props(styles.header, !compactModeEnabled && styles.headerStart)}>
            <DialogHeader
              align={compactModeEnabled ? "center" : "start"}
              left={
                onRightPaneBack && (
                  <IconButton
                    aria-label="Back"
                    onClick={onRightPaneBack}
                  >
                    <BackIcon />
                  </IconButton>
                )
              }
              onClose={onClose}
              size={compactModeEnabled ? "18" : "17"}
              title={rightPaneHeaderLabel}
            />
          </div>
          <div {...stylex.props(styles.paneContent)}>{rightPaneContent}</div>
        </div>
      )}
    </div>
  );
}
