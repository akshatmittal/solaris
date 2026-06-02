import React, { Fragment, useContext, useEffect, useRef, useState } from "react";

import { touchableStyles } from "../../css/touchableStyles";
import { t } from "../../translations";
import { isSafari } from "../../utils/browsers";
import { groupBy } from "../../utils/groupBy";
import { addLatestWalletId } from "../../wallets/latestWalletId";
import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { Box } from "../Box/Box";
import { CloseButton } from "../CloseButton/CloseButton";
import { ConnectModalIntro } from "../ConnectModal/ConnectModalIntro";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { BackIcon } from "../Icons/Back";
import { InfoButton } from "../InfoButton/InfoButton";
import { ModalSelection } from "../ModalSelection/ModalSelection";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { ModalSizeContext, ModalSizeOptions } from "../RainbowKitProvider/ModalSizeContext";
import { WalletButtonContext } from "../RainbowKitProvider/WalletButtonContext";
import { Text } from "../Text/Text";
import { ConnectDetail } from "./ConnectDetails";
import { GET_WALLET_URL } from "./constants";
import { ScrollClassName, sidebar, sidebarCompactMode } from "./DesktopOptions.css";

export enum WalletStep {
  None = "NONE",
  LearnCompact = "LEARN_COMPACT",
  Connect = "CONNECT",
}

export function DesktopOptions({ onClose }: { onClose: () => void }) {
  const titleId = "rk_connect_title";
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [selectedWallet, setSelectedWallet] = useState<WalletConnector>();
  const [qrCodeUri, setQrCodeUri] = useState<string>();
  const hasQrCode = !!selectedWallet?.qrCode && qrCodeUri;
  const [connectionError, setConnectionError] = useState(false);
  const [walletStep, setWalletStep] = useState<WalletStep>(WalletStep.None);
  const modalSize = useContext(ModalSizeContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;
  const { disclaimer: Disclaimer } = useContext(AppContext);
  const safari = isSafari();

  const initialized = useRef(false);
  const selectWalletRef = useRef<((wallet: WalletConnector) => Promise<void>) | null>(null);

  const { connector } = useContext(WalletButtonContext);

  // The `WalletButton` component made the connect modal appear empty when trying to connect.
  // This happened because of a mix up between EIP-6963 and RainbowKit connectors.
  // The problem was finding the correct `wallet.id`. `WalletButton` uses RainbowKit's id,
  // but EIP-6963 uses `rdns` for its id. We now don't merge EIP-6963 and RainbowKit
  // connectors if user interacts with `WalletButton` component.
  const mergeEIP6963WithRkConnectors = !connector;

  const wallets = useWalletConnectors(mergeEIP6963WithRkConnectors)
    .filter((wallet) => wallet.ready)
    .sort((a, b) => a.groupIndex - b.groupIndex);
  const groupedWallets = groupBy(wallets, (wallet) => wallet.groupName);

  const supportedGroupNames = ["Recommended", "Other", "Popular", "More", "Others", "Installed"];

  const connectToWallet = (wallet: WalletConnector) => {
    setConnectionError(false);
    if (wallet.ready) {
      wallet?.connect?.()?.catch(() => {
        setConnectionError(true);
      });
    }
  };

  const onDesktopUri = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);

    if (!sWallet?.getDesktopUri) return;

    setTimeout(async () => {
      const uri = await sWallet?.getDesktopUri?.();
      if (uri) window.open(uri, safari ? "_blank" : "_self");
    }, 0);
  };

  const onQrCode = async (wallet: WalletConnector) => {
    const sWallet = wallets.find((w) => wallet.id === w.id);

    const uri = await sWallet?.getQrCodeUri?.();

    setQrCodeUri(uri);

    // This timeout prevents the UI from flickering if connection is instant,
    // otherwise users will see a flash of the "connecting" state.
    setTimeout(
      () => {
        setSelectedWallet(sWallet);
        changeWalletStep(WalletStep.Connect);
      },
      uri ? 0 : 50,
    );
  };

  const selectWallet = async (wallet: WalletConnector) => {
    // We still want to get the latest wallet id to show connected
    // green badge on our custom WalletButton API
    addLatestWalletId(wallet.id);

    // This ensures that we listen to the connector "message" event
    // before connecting to the wallet
    if (wallet.ready) {
      onQrCode(wallet);
      onDesktopUri(wallet);
    }

    connectToWallet(wallet);
    setSelectedOptionId(wallet.id);

    if (!wallet.ready) {
      window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer");
      return;
    }
  };
  selectWalletRef.current = selectWallet;

  // If a user hasn't installed the extension we will get the
  // qr code with additional steps on how to get the wallet
  useEffect(() => {
    if (connector && !initialized.current) {
      setWalletStep(WalletStep.Connect);
      selectWalletRef.current?.(connector);
      initialized.current = true;
    }
  }, [connector]);

  const clearSelectedWallet = () => {
    setSelectedOptionId(undefined);
    setSelectedWallet(undefined);
    setQrCodeUri(undefined);
  };
  const changeWalletStep = (newWalletStep: WalletStep) => {
    setWalletStep(newWalletStep);
  };
  let walletContent = null;
  let headerLabel = null;
  let headerBackButtonLink: WalletStep | null = null;
  let headerBackButtonCallback: () => void;

  useEffect(() => {
    setConnectionError(false);
  }, [walletStep, selectedWallet]);

  switch (walletStep) {
    case WalletStep.None:
      walletContent = (
        <ConnectModalIntro getWallet={() => window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer")} />
      );
      break;
    case WalletStep.LearnCompact:
      walletContent = (
        <ConnectModalIntro
          compactModeEnabled={compactModeEnabled}
          getWallet={() => window.open(GET_WALLET_URL, "_blank", "noopener,noreferrer")}
        />
      );
      headerLabel = t("intro.title");
      headerBackButtonLink = WalletStep.None;
      break;
    case WalletStep.Connect:
      walletContent = selectedWallet && (
        <ConnectDetail
          compactModeEnabled={compactModeEnabled}
          connectionError={connectionError}
          onClose={onClose}
          qrCodeUri={qrCodeUri}
          reconnect={connectToWallet}
          wallet={selectedWallet}
        />
      );
      headerLabel =
        hasQrCode &&
        (selectedWallet.name === "WalletConnect"
          ? t("connect_scan.fallback_title")
          : t("connect_scan.title", {
              wallet: selectedWallet.name,
            }));
      headerBackButtonLink = compactModeEnabled ? (connector ? null : WalletStep.None) : null;
      headerBackButtonCallback = compactModeEnabled ? (!connector ? clearSelectedWallet : () => {}) : () => {};
      break;
    default:
      break;
  }
  return (
    <Box
      display="flex"
      flexDirection="row"
      style={{ maxHeight: compactModeEnabled ? 468 : 504 }}
    >
      {(compactModeEnabled ? walletStep === WalletStep.None : true) && (
        <Box
          className={compactModeEnabled ? sidebarCompactMode : sidebar}
          display="flex"
          flexDirection="column"
          marginTop="16"
        >
          <Box
            display="flex"
            justifyContent="space-between"
          >
            {compactModeEnabled && Disclaimer && (
              <Box
                marginLeft="16"
                width="28"
              >
                <InfoButton onClick={() => changeWalletStep(WalletStep.LearnCompact)} />
              </Box>
            )}
            {compactModeEnabled && !Disclaimer && (
              <Box
                marginLeft="16"
                width="28"
              />
            )}
            <Box
              marginLeft={compactModeEnabled ? "0" : "6"}
              paddingBottom="8"
              paddingTop="2"
              paddingX="18"
            >
              <Text
                as="h1"
                color="modalText"
                id={titleId}
                size="18"
                weight="heavy"
                testId={"connect-header-label"}
              >
                {t("connect.title")}
              </Text>
            </Box>
            {compactModeEnabled && (
              <Box marginRight="16">
                <CloseButton onClose={onClose} />
              </Box>
            )}
          </Box>
          <Box
            className={ScrollClassName}
            paddingBottom="18"
          >
            {Object.entries(groupedWallets).map(
              ([groupName, wallets]) =>
                wallets.length > 0 && (
                  <Fragment key={groupName}>
                    {groupName ? (
                      <Box
                        marginBottom="8"
                        marginTop="16"
                        marginX="6"
                      >
                        <Text
                          color={groupName === "Installed" ? "accentColor" : "modalTextSecondary"}
                          size="14"
                          weight="bold"
                        >
                          {supportedGroupNames.includes(groupName)
                            ? t(`connector_group.${groupName.toLowerCase()}`)
                            : groupName}
                        </Text>
                      </Box>
                    ) : null}
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="4"
                    >
                      {wallets.map((wallet) => {
                        return (
                          <ModalSelection
                            currentlySelected={wallet.id === selectedOptionId}
                            iconBackground={wallet.iconBackground}
                            iconUrl={wallet.iconUrl}
                            key={wallet.id}
                            name={wallet.name}
                            onClick={() => selectWallet(wallet)}
                            ready={wallet.ready}
                            recent={wallet.recent}
                            testId={`wallet-option-${wallet.id}`}
                            isRainbowKitConnector={wallet.isRainbowKitConnector}
                          />
                        );
                      })}
                    </Box>
                  </Fragment>
                ),
            )}
          </Box>
          {compactModeEnabled && (
            <>
              <Box
                background="generalBorder"
                height="1"
                marginTop="-1"
              />
              {Disclaimer ? (
                <Box
                  paddingX="24"
                  paddingY="16"
                  textAlign="center"
                >
                  <Disclaimer
                    Link={DisclaimerLink}
                    Text={DisclaimerText}
                  />
                </Box>
              ) : (
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                  paddingX="24"
                  paddingY="16"
                >
                  <Box paddingY="4">
                    <Text
                      color="modalTextSecondary"
                      size="14"
                      weight="medium"
                    >
                      {t("connect.new_to_ethereum.description")}
                    </Text>
                  </Box>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                    gap="4"
                    justifyContent="center"
                  >
                    <Box
                      className={touchableStyles({
                        active: "shrink",
                        hover: "grow",
                      })}
                      cursor="pointer"
                      onClick={() => changeWalletStep(WalletStep.LearnCompact)}
                      paddingY="4"
                      style={{ willChange: "transform" }}
                      transition="default"
                    >
                      <Text
                        color="accentColor"
                        size="14"
                        weight="bold"
                      >
                        {t("connect.new_to_ethereum.learn_more.label")}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
      {(compactModeEnabled ? walletStep !== WalletStep.None : true) && (
        <>
          {!compactModeEnabled && (
            <Box
              background="generalBorder"
              minWidth="1"
              width="1"
            />
          )}
          <Box
            display="flex"
            flexDirection="column"
            margin="16"
            style={{ flexGrow: 1 }}
          >
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              marginBottom="12"
            >
              <Box width="28">
                {headerBackButtonLink && (
                  <Box
                    as="button"
                    className={touchableStyles({
                      active: "shrinkSm",
                      hover: "growLg",
                    })}
                    color="accentColor"
                    onClick={() => {
                      if (headerBackButtonLink) {
                        changeWalletStep(headerBackButtonLink);
                      }
                      headerBackButtonCallback?.();
                    }}
                    paddingX="8"
                    paddingY="4"
                    style={{
                      boxSizing: "content-box",
                      height: 17,
                      willChange: "transform",
                    }}
                    transition="default"
                    type="button"
                  >
                    <BackIcon />
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                style={{ flexGrow: 1 }}
              >
                {headerLabel && (
                  <Text
                    color="modalText"
                    size="18"
                    textAlign="center"
                    weight="heavy"
                  >
                    {headerLabel}
                  </Text>
                )}
              </Box>
              <CloseButton onClose={onClose} />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              style={{ minHeight: compactModeEnabled ? 396 : 432 }}
            >
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap="6"
                height="full"
                justifyContent="center"
                marginX="8"
              >
                {walletContent}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
