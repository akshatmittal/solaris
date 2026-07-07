import React, { useMemo, useState } from "react";

import { Box } from "../../../components/Box/Box";
import { CloseButton } from "../../../components/CloseButton/CloseButton";
import { ConnectModalIntro } from "../../../components/ConnectModal/ConnectModalIntro";
import { ScrollClassName, sidebar, sidebarCompactMode } from "../../../components/ConnectOptions/DesktopOptions.css";
import { WalletListView, type WalletListViewItem } from "../../../components/ConnectOptions/WalletListView";
import { Dialog } from "../../../components/Dialog/Dialog";
import { DialogContent } from "../../../components/Dialog/DialogContent";
import { DisclaimerLink } from "../../../components/Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../../../components/Disclaimer/DisclaimerText";
import { BackIcon } from "../../../components/Icons/Back";
import { InfoButton } from "../../../components/InfoButton/InfoButton";
import { AppContext } from "../../../components/RainbowKitProvider/AppContext";
import { ModalSizeContext, ModalSizeOptions } from "../../../components/RainbowKitProvider/ModalSizeContext";
import { Text } from "../../../components/Text/Text";
import { touchableStyles } from "../../../css/touchableStyles";
import { t } from "../../../translations";
import { isMobile } from "../../../utils/isMobile";
import fallbackWalletIcon from "../../../wallets/walletConnectors/injectedWallet/injectedWallet.svg";
import { useSolanaConnectWallet, useSolanaWalletConnectors } from "../../hooks";
import {
  addLatestSolanaWalletId,
  addRecentSolanaWalletId,
  getRecentSolanaWalletIds,
} from "../../wallets/recentSolanaWalletIds";

enum SolanaWalletStep {
  List = "LIST",
  LearnCompact = "LEARN_COMPACT",
}

export interface SolanaConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function SolanaConnectModal({ onClose, open }: SolanaConnectModalProps) {
  const titleId = "rk_connect_title";
  const connectors = useSolanaWalletConnectors();
  const { connect, error, isConnecting, resetError } = useSolanaConnectWallet();
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>();
  const [walletStep, setWalletStep] = useState<SolanaWalletStep>(SolanaWalletStep.List);
  const modalSize = React.useContext(ModalSizeContext);
  const { disclaimer: Disclaimer } = React.useContext(AppContext);
  const compactModeEnabled = modalSize === ModalSizeOptions.COMPACT;

  const groupedWallets = useMemo(() => {
    const recentIds = new Set(getRecentSolanaWalletIds());
    const wallets = connectors
      .map<WalletListViewItem>((connector) => ({
        groupName: connector.ready ? "Installed" : "Other",
        iconUrl: connector.icon || fallbackWalletIcon,
        id: connector.id,
        isRainbowKitConnector: false,
        name: connector.name,
        ready: connector.ready,
        recent: recentIds.has(connector.id),
      }))
      .sort((a, b) => Number(b.recent) - Number(a.recent) || a.name.localeCompare(b.name));

    const installed = wallets.filter((wallet) => wallet.ready);
    const other = wallets.filter((wallet) => !wallet.ready);

    return {
      ...(installed.length ? { Installed: installed } : {}),
      ...(other.length ? { Other: other } : {}),
    };
  }, [connectors]);

  const selectWallet = async (wallet: WalletListViewItem) => {
    if (!wallet.ready || isConnecting) return;

    resetError();
    setSelectedWalletId(wallet.id);
    addLatestSolanaWalletId(wallet.id);
    addRecentSolanaWalletId(wallet.id);

    try {
      await connect(wallet.id);
    } catch {
      // ConnectorKit exposes the error through the hook.
    }
  };

  const mobile = isMobile();
  const walletList = (
    <>
      <WalletListView
        groupedWallets={groupedWallets}
        onSelectWallet={selectWallet}
        selectedWalletId={selectedWalletId}
      />
      {error ? (
        <Box
          marginTop="12"
          marginX="6"
        >
          <Text
            color="error"
            size="14"
            weight="medium"
          >
            {error.message}
          </Text>
        </Box>
      ) : null}
    </>
  );

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent
        bottomSheetOnMobile
        padding="0"
        wide={!compactModeEnabled}
      >
        <Box
          display="flex"
          flexDirection="row"
          style={{ maxHeight: compactModeEnabled ? 468 : 504 }}
        >
          {(compactModeEnabled ? walletStep === SolanaWalletStep.List : true) && (
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
                {compactModeEnabled && Disclaimer ? (
                  <Box
                    marginLeft="16"
                    width="28"
                  >
                    <InfoButton onClick={() => setWalletStep(SolanaWalletStep.LearnCompact)} />
                  </Box>
                ) : null}
                {compactModeEnabled && !Disclaimer ? (
                  <Box
                    marginLeft="16"
                    width="28"
                  />
                ) : null}
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
                    testId="connect-header-label"
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
                {walletList}
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
                        className={touchableStyles({
                          active: "shrink",
                          hover: "grow",
                        })}
                        cursor="pointer"
                        onClick={() => setWalletStep(SolanaWalletStep.LearnCompact)}
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
                  )}
                </>
              )}
            </Box>
          )}
          {(compactModeEnabled ? walletStep !== SolanaWalletStep.List : true) && (
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
                    {compactModeEnabled && (
                      <Box
                        as="button"
                        className={touchableStyles({
                          active: "shrinkSm",
                          hover: "growLg",
                        })}
                        color="accentColor"
                        onClick={() => setWalletStep(SolanaWalletStep.List)}
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
                    {compactModeEnabled ? (
                      <Text
                        color="modalText"
                        size="18"
                        textAlign="center"
                        weight="heavy"
                      >
                        {t("intro.title")}
                      </Text>
                    ) : null}
                  </Box>
                  <CloseButton onClose={onClose} />
                </Box>
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                  gap="6"
                  height="full"
                  justifyContent="center"
                  marginX="8"
                  style={{ minHeight: compactModeEnabled ? 396 : 432 }}
                >
                  <ConnectModalIntro
                    compactModeEnabled={compactModeEnabled || mobile}
                    getWallet={() =>
                      window.open(
                        "https://solana.com/ecosystem/explore?categories=wallet",
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
