import React from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, fonts, media, radii, shadows } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { SpinnerIcon } from "../Icons/Spinner";

const styles = stylex.create({
  button: {
    alignItems: "center",
    backgroundColor: {
      default: colors.connectButtonBackground,
      ":hover": { default: null, [media.hover]: colors.connectButtonHover },
    },
    borderColor: colors.generalBorder,
    borderRadius: radii.menuButton,
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow: shadows.connectButton,
    color: colors.connectButtonText,
    display: "flex",
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 600,
    gap: 10,
    maxWidth: "fit-content",
    minHeight: 44,
    paddingBlock: 6,
    paddingLeft: 6,
    paddingRight: 14,
    WebkitFontSmoothing: "antialiased",
  },
  disabled: {
    pointerEvents: "none",
  },
  icon: {
    display: "flex",
  },
  connected: {
    backgroundColor: colors.connectionIndicator,
    borderRadius: 9999,
    height: 8,
    width: 8,
  },
});

export interface WalletButtonViewConnector {
  iconBackground?: string;
  iconUrl?: string | (() => Promise<string>);
  id: string;
  name: string;
}

export interface WalletButtonViewProps {
  connected: boolean;
  connector: WalletButtonViewConnector;
  loading: boolean;
  mounted: boolean;
  onConnect: () => void | Promise<void>;
  ready: boolean;
}

export function WalletButtonView({ connected, connector, loading, mounted, onConnect, ready }: WalletButtonViewProps) {
  const isDisabled = !ready || loading;

  if (!mounted) return null;

  return (
    <button
      {...stylex.props(reset.button, styles.button, isDisabled && styles.disabled, press.scale)}
      data-testid={`solaris-wallet-button-${connector.id}`}
      disabled={isDisabled}
      onClick={onConnect}
      type="button"
    >
      <span {...stylex.props(styles.icon)}>
        {loading ? (
          <SpinnerIcon />
        ) : (
          <AsyncImage
            background={connector.iconBackground}
            radius={8}
            size={30}
            src={connector.iconUrl}
          />
        )}
      </span>
      <span data-testid={`solaris-wallet-button-label-${connector.id}`}>
        {loading
          ? t("connect.status.connecting", {
              wallet: connector.name,
            })
          : connector.name}
      </span>
      {connected ? <span {...stylex.props(styles.connected)} /> : null}
    </button>
  );
}
