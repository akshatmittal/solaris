import React, { useEffect, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, media, motion } from "../../css/vars.stylex";
import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { ActionButton } from "../Button/ActionButton";
import { CancelIcon } from "../Icons/Cancel";
import { CopiedIcon } from "../Icons/Copied";
import { CopyIcon } from "../Icons/Copy";
import { QRCode } from "../QRCode/QRCode";
import { Text } from "../Text/Text";
import { type ConnectionError, ConnectStatus } from "./ConnectStatus";
import { GET_WALLET_URL } from "./constants";

const iconIn = stylex.keyframes({
  from: { opacity: 0, transform: "scale(0.95)" },
  to: { opacity: 1, transform: "none" },
});

const iconFadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

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
  copy: {
    display: "flex",
    justifyContent: "center",
    marginTop: -8,
  },
  // The copy icon is 17px wide and the result icons are 16px, so a fixed width keeps the button width.
  icon: {
    color: colors.modalTextSecondary,
    display: "flex",
    justifyContent: "center",
    width: 17,
  },
  iconChanged: {
    animationDuration: motion.enter,
    animationName: { default: iconIn, [media.reducedMotion]: iconFadeIn },
    animationTimingFunction: motion.easeOut,
  },
  copied: {
    color: colors.success,
  },
  failed: {
    color: colors.error,
  },
  status: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
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
  onCloseModal,
  qrCodeUri,
  reconnect,
  titleId,
  wallet,
}: {
  connectionError: ConnectionError | null;
  onCloseModal: () => void;
  qrCodeUri?: string;
  reconnect: (wallet: WalletConnector) => void;
  titleId: string;
  wallet: WalletConnector;
}) {
  const { iconBackground, iconUrl, name, qrCode, ready, shortName, showWalletConnectModal, getDesktopUri } = wallet;
  const isDesktopDeepLinkAvailable = !!getDesktopUri;
  const safari = isSafari();
  const showQrCode = qrCode && !connectionError;
  const [walletConnectModal, setWalletConnectModal] = useState<"idle" | "opening" | "failed">("idle");
  // A new object on each copy restarts the timer. The result shows only for the URI it was copied from.
  const [copyResult, setCopyResult] = useState<{ copied: boolean; uri: string }>();
  const copy = copyResult && copyResult.uri === qrCodeUri ? copyResult : undefined;

  useEffect(() => {
    if (copyResult) {
      const timer = setTimeout(() => setCopyResult(undefined), 1500);
      return () => clearTimeout(timer);
    }
  }, [copyResult]);

  const copyUri = () => {
    if (qrCodeUri) {
      try {
        void navigator.clipboard.writeText(qrCodeUri).then(
          () => setCopyResult({ copied: true, uri: qrCodeUri }),
          () => setCopyResult({ copied: false, uri: qrCodeUri }),
        );
      } catch {
        setCopyResult({ copied: false, uri: qrCodeUri });
      }
    }
  };

  const onDesktopUri = async () => {
    const uri = await getDesktopUri?.();
    window.open(uri, safari ? "_blank" : "_self");
  };

  const secondaryAction: {
    busy: boolean;
    description: string;
    error: boolean;
    href?: string;
    label: string;
    onClick?: () => void;
  } | null = showWalletConnectModal
    ? {
        busy: walletConnectModal === "opening",
        description:
          walletConnectModal === "failed" ? t("connect.status.declined") : t("connect.walletconnect.description"),
        error: walletConnectModal === "failed",
        label: t("connect.walletconnect.open.label"),
        onClick: async () => {
          setWalletConnectModal("opening");
          try {
            await showWalletConnectModal(onCloseModal);
            setWalletConnectModal("idle");
          } catch {
            setWalletConnectModal("failed");
          }
        },
      }
    : showQrCode
      ? {
          busy: false,
          description: t("connect.secondary_action.get.description", {
            wallet: shortName ?? name,
          }),
          error: false,
          href: GET_WALLET_URL,
          label: t("connect.secondary_action.get.label", { wallet: shortName ?? name }),
        }
      : null;

  return (
    <div {...stylex.props(styles.container)}>
      {showQrCode ? (
        <>
          <div {...stylex.props(styles.qr)}>
            <QRCode
              logoBackground={iconBackground}
              logoUrl={iconUrl}
              size={344}
              uri={qrCodeUri}
            />
          </div>
          <div {...stylex.props(styles.copy)}>
            <ActionButton
              disabled={!qrCodeUri}
              icon={
                <span
                  {...stylex.props(
                    styles.icon,
                    copy && styles.iconChanged,
                    copy && (copy.copied ? styles.copied : styles.failed),
                  )}
                  aria-hidden
                  key={copy ? String(copy.copied) : "idle"}
                >
                  {!copy ? (
                    <CopyIcon />
                  ) : copy.copied ? (
                    <CopiedIcon />
                  ) : (
                    <CancelIcon
                      height={16}
                      width={16}
                    />
                  )}
                </span>
              }
              label={t("connect_scan.copy.label")}
              onClick={copyUri}
              size="small"
              type="secondary"
            />
            <span
              {...stylex.props(styles.status)}
              role="status"
            >
              {copy ? (copy.copied ? t("connect_scan.copy.copied") : t("connect_scan.copy.failed")) : ""}
            </span>
          </div>
        </>
      ) : (
        <ConnectStatus
          confirm={t("connect.status.confirm")}
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
          <div aria-live="polite">
            <Text
              color={secondaryAction.error ? "error" : "modalTextSecondary"}
              size="14"
              weight="regular"
            >
              {secondaryAction.description}
            </Text>
          </div>
          <ActionButton
            href={secondaryAction.href}
            label={secondaryAction.label}
            loading={secondaryAction.busy}
            onClick={secondaryAction.onClick}
            size="small"
            type="secondary"
          />
        </div>
      )}
    </div>
  );
}
