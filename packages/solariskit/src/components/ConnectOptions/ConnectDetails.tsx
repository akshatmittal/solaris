import React from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { ActionButton } from "../Button/ActionButton";
import { QRCode } from "../QRCode/QRCode";
import { Text } from "../Text/Text";
import { type ConnectionError, ConnectStatus } from "./ConnectStatus";
import { GET_WALLET_URL } from "./constants";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: 16,
    width: "100%",
  },
  // The white quiet zone bleeds past the content edge, so the QR modules align with the 24px inset.
  qr: {
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    marginInline: -16,
    marginTop: -16,
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
  titleId,
  wallet,
}: {
  connectionError: ConnectionError | null;
  onClose: () => void;
  qrCodeUri?: string;
  reconnect: (wallet: WalletConnector) => void;
  titleId: string;
  wallet: WalletConnector;
}) {
  const { iconBackground, iconUrl, name, qrCode, ready, shortName, showWalletConnectModal, getDesktopUri } = wallet;
  const isDesktopDeepLinkAvailable = !!getDesktopUri;
  const safari = isSafari();
  const showQrCode = qrCode && !connectionError;

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
    : showQrCode
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
      {showQrCode ? (
        <div {...stylex.props(styles.qr)}>
          <QRCode
            logoBackground={iconBackground}
            logoUrl={iconUrl}
            size={344}
            uri={qrCodeUri}
          />
        </div>
      ) : (
        <ConnectStatus
          connectionError={connectionError}
          onRetry={() => {
            if (isDesktopDeepLinkAvailable) {
              onDesktopUri();
            }
            reconnect(wallet);
          }}
          titleId={titleId}
          wallet={wallet}
        />
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
