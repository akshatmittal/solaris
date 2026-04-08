import React from "react";

import { useWindowSize } from "../../hooks/useWindowSize";
import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box, type BoxProps } from "../Box/Box";
import { ActionButton } from "../Button/ActionButton";
import { SpinnerIcon } from "../Icons/Spinner";
import { QRCode } from "../QRCode/QRCode";
import { Text } from "../Text/Text";
import { GET_WALLET_URL } from "./constants";

const LOGO_SIZE: BoxProps["height"] = "44";

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
  const { iconBackground, iconUrl, name, qrCode, ready, showWalletConnectModal, getDesktopUri } = wallet;
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
            wallet: name,
          }),
          href: GET_WALLET_URL,
          label: t("connect.secondary_action.get.label"),
        }
      : null;

  const { width: windowWidth } = useWindowSize();
  const smallWindow = windowWidth && windowWidth < 768;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="full"
      width="full"
    >
      {hasQrCode ? (
        <Box
          alignItems="center"
          display="flex"
          height="full"
          justifyContent="center"
        >
          <QRCode
            logoBackground={iconBackground}
            logoSize={compactModeEnabled ? 60 : 72}
            logoUrl={iconUrl}
            size={compactModeEnabled ? 318 : smallWindow ? Math.max(280, Math.min(windowWidth - 308, 382)) : 382}
            uri={qrCodeUri}
          />
        </Box>
      ) : (
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          style={{ flexGrow: 1 }}
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap="8"
          >
            <Box
              borderRadius="10"
              height={LOGO_SIZE}
              overflow="hidden"
            >
              <AsyncImage
                useAsImage={!wallet.isRainbowKitConnector}
                height={LOGO_SIZE}
                src={iconUrl}
                width={LOGO_SIZE}
              />
            </Box>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap="4"
              paddingX="32"
              style={{ textAlign: "center" }}
            >
              <Text
                color="modalText"
                size="18"
                weight="bold"
              >
                {t("connect.status.opening", {
                  wallet: name,
                })}
              </Text>
              {ready && !hasQrCode && (
                <>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Text
                      color="modalTextSecondary"
                      size="14"
                      textAlign="center"
                      weight="medium"
                    >
                      {t("connect.status.confirm")}
                    </Text>
                  </Box>
                  <Box
                    alignItems="center"
                    color="modalText"
                    display="flex"
                    flexDirection="row"
                    height="32"
                    marginTop="8"
                  >
                    {connectionError ? (
                      <ActionButton
                        label={t("connect.secondary_action.retry.label")}
                        onClick={async () => {
                          if (isDesktopDeepLinkAvailable) onDesktopUri();
                          reconnect(wallet);
                        }}
                      />
                    ) : (
                      <Box color="modalTextSecondary">
                        <SpinnerIcon />
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Box
        alignItems="center"
        borderRadius="10"
        display="flex"
        flexDirection="row"
        gap="8"
        height="28"
        justifyContent="space-between"
        marginTop="12"
      >
        {ready && secondaryAction && (
          <>
            <Text
              color="modalTextSecondary"
              size="14"
              weight="medium"
            >
              {secondaryAction.description}
            </Text>
            <ActionButton
              href={secondaryAction.href}
              label={secondaryAction.label}
              onClick={secondaryAction.onClick}
              type="secondary"
            />
          </>
        )}
      </Box>
    </Box>
  );
}
