import React from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { ActionButton } from "../Button/ActionButton";
import { QRCode } from "../QRCode/QRCode";
import { Text } from "../Text/Text";
import { GET_WALLET_URL } from "./constants";

const orbit = stylex.keyframes({
  from: { strokeDashoffset: 0 },
  to: { strokeDashoffset: -100 },
});

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: 16,
    width: "100%",
  },
  center: {
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
  },
  status: {
    flexDirection: "column",
    gap: 12,
    textAlign: "center",
  },
  iconWrap: {
    padding: 10,
    position: "relative",
  },
  ring: {
    fill: "none",
    height: "100%",
    inset: 0,
    position: "absolute",
    strokeWidth: 3,
    width: "100%",
  },
  ringTrack: {
    stroke: colors.accentColor,
    strokeOpacity: 0.2,
  },
  ringError: {
    stroke: colors.error,
  },
  ringArc: {
    animationDuration: "1.2s",
    animationIterationCount: "infinite",
    animationName: orbit,
    animationTimingFunction: "linear",
    stroke: colors.accentColor,
    strokeDasharray: "30 70",
    strokeLinecap: "round",
  },
  // The white quiet zone bleeds past the content edge, so the QR modules align with the 24px inset.
  qr: {
    marginInline: -16,
    marginTop: -16,
  },
  reserved: {
    visibility: "hidden",
  },
  statusText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  secondaryAction: {
    alignItems: "center",
    display: "flex",
    gap: 12,
    justifyContent: "space-between",
    minHeight: 32,
  },
});

export function ConnectDetail({
  compactModeEnabled,
  connectionError,
  onClose,
  qrCodeUri,
  reconnect,
  wallet,
}: {
  compactModeEnabled: boolean;
  connectionError: boolean;
  onClose: () => void;
  qrCodeUri?: string;
  reconnect: (wallet: WalletConnector) => void;
  wallet: WalletConnector;
}) {
  const { iconBackground, iconUrl, name, qrCode, ready, shortName, showWalletConnectModal, getDesktopUri } = wallet;
  const isDesktopDeepLinkAvailable = !!getDesktopUri;
  const safari = isSafari();
  const hasQrCode = qrCode && qrCodeUri;

  const onDesktopUri = async () => {
    const uri = await getDesktopUri?.();
    window.open(uri, safari ? "_blank" : "_self");
  };

  const secondaryAction: {
    description: string;
    href?: string;
    label: string;
    onClick?: () => void;
  } | null = showWalletConnectModal
    ? {
        description: !compactModeEnabled
          ? t("connect.walletconnect.description.full")
          : t("connect.walletconnect.description.compact"),
        label: t("connect.walletconnect.open.label"),
        onClick: () => {
          onClose();
          showWalletConnectModal();
        },
      }
    : hasQrCode
      ? {
          description: t("connect.secondary_action.get.description", {
            wallet: shortName ?? name,
          }),
          href: GET_WALLET_URL,
          label: t("connect.secondary_action.get.label", { wallet: shortName ?? name }),
        }
      : null;

  return (
    <div {...stylex.props(styles.container)}>
      {hasQrCode ? (
        <div {...stylex.props(styles.center, styles.qr)}>
          <QRCode
            logoBackground={iconBackground}
            logoUrl={iconUrl}
            size={344}
            uri={qrCodeUri}
          />
        </div>
      ) : (
        <div {...stylex.props(styles.center, styles.status)}>
          <div {...stylex.props(styles.iconWrap)}>
            <AsyncImage
              background={iconBackground}
              radius={16}
              size={64}
              src={iconUrl}
              useAsImage={!wallet.isRainbowKitConnector}
            />
            {ready && (
              <svg
                {...stylex.props(styles.ring)}
                aria-hidden
                viewBox="0 0 84 84"
              >
                <rect
                  {...stylex.props(connectionError ? styles.ringError : styles.ringTrack)}
                  height="81"
                  rx="24.5"
                  width="81"
                  x="1.5"
                  y="1.5"
                />
                {!connectionError && (
                  <rect
                    {...stylex.props(styles.ringArc)}
                    height="81"
                    pathLength="100"
                    rx="24.5"
                    width="81"
                    x="1.5"
                    y="1.5"
                  />
                )}
              </svg>
            )}
          </div>
          <div {...stylex.props(styles.statusText)}>
            <Text
              color="modalText"
              size="18"
              weight="semibold"
            >
              {connectionError
                ? t("connect.status.declined")
                : t("connect.status.opening", {
                    wallet: name,
                  })}
            </Text>
            {ready && (
              <Text
                color="modalTextSecondary"
                size="14"
                weight="regular"
              >
                {connectionError ? t("connect.status.declined_description") : t("connect.status.confirm")}
              </Text>
            )}
          </div>
          {ready && (
            <div {...stylex.props(!connectionError && styles.reserved)}>
              <ActionButton
                label={t("connect.secondary_action.retry.label")}
                onClick={async () => {
                  if (isDesktopDeepLinkAvailable) onDesktopUri();
                  reconnect(wallet);
                }}
              />
            </div>
          )}
        </div>
      )}
      <div {...stylex.props(styles.secondaryAction)}>
        {ready && secondaryAction && (
          <>
            <Text
              color="modalTextSecondary"
              size="14"
              weight="regular"
            >
              {secondaryAction.description}
            </Text>
            <ActionButton
              href={secondaryAction.href}
              label={secondaryAction.label}
              onClick={secondaryAction.onClick}
              size="small"
              type="secondary"
            />
          </>
        )}
      </div>
    </div>
  );
}
