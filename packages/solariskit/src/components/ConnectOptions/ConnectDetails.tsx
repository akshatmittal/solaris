import React from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { ActionButton } from "../Button/ActionButton";
import { SpinnerIcon } from "../Icons/Spinner";
import { QRCode } from "../QRCode/QRCode";
import { Text } from "../Text/Text";
import { GET_WALLET_URL } from "./constants";

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
  // Matches the header above, so the icon, text, and spinner or Retry are centered in the card.
  statusBalanced: {
    paddingBottom: 52,
  },
  // Holds the spinner while connecting and Retry after a decline, so the layout does not move.
  action: {
    alignItems: "center",
    color: colors.accentColor,
    display: "flex",
    justifyContent: "center",
    minHeight: 44,
  },
  // The white quiet zone bleeds past the content edge, so the QR modules align with the 24px inset.
  qr: {
    marginInline: -16,
    marginTop: -16,
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
  connectionError,
  onClose,
  qrCodeUri,
  reconnect,
  wallet,
}: {
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
        description: t("connect.walletconnect.description"),
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
        <div {...stylex.props(styles.center, styles.status, ready && styles.statusBalanced)}>
          <AsyncImage
            background={iconBackground}
            radius={16}
            size={64}
            src={iconUrl}
            useAsImage={!wallet.isRainbowKitConnector}
          />
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
            <div {...stylex.props(styles.action)}>
              {connectionError ? (
                <ActionButton
                  label={t("connect.secondary_action.retry.label")}
                  onClick={async () => {
                    if (isDesktopDeepLinkAvailable) onDesktopUri();
                    reconnect(wallet);
                  }}
                />
              ) : (
                <SpinnerIcon
                  height={24}
                  width={24}
                />
              )}
            </div>
          )}
        </div>
      )}
      {ready && secondaryAction && (
        <div {...stylex.props(styles.secondaryAction)}>
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
        </div>
      )}
    </div>
  );
}
