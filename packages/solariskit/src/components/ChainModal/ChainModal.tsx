import React, { useEffect, useState } from "react";

import { useConnection, useDisconnect, useSwitchChain } from "wagmi";
import { useConfig } from "wagmi";

import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { t } from "../../translations";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { isMobile } from "../../utils/isMobile";
import { Box } from "../Box/Box";
import { CloseButton } from "../CloseButton/CloseButton";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { DisconnectSqIcon } from "../Icons/DisconnectSq";
import { MenuButton } from "../MenuButton/MenuButton";
import { useChainSearchThreshold, useRainbowKitChains } from "../RainbowKitProvider/RainbowKitChainContext";
import { Text } from "../Text/Text";
import Chain from "./Chain";
import { DesktopScrollClassName, MobileScrollClassName, SearchInputClassName } from "./ChainModal.css";

export interface ChainModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChainModal({ onClose, open }: ChainModalProps) {
  const { chainId: connectedChainId, isConnected } = useConnection();
  const currentChainId = useSelectedChainId(connectedChainId);
  const { chains } = useConfig();
  const [pendingChainId, setPendingChainId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { mutate: switchChain } = useSwitchChain({
    mutation: {
      onMutate: ({ chainId: _chainId }) => {
        setPendingChainId(_chainId);
      },
      onSettled: () => {
        setPendingChainId(null);
        onClose();
      },
    },
  });
  const { mutate: disconnect } = useDisconnect();
  const titleId = "rk_chain_modal_title";
  const mobile = isMobile();
  const isConnectedToUnsupportedChain = isConnected && !isChainIdSupported(chains, connectedChainId);
  const chainIconSize = mobile ? "36" : "28";
  const rainbowkitChains = useRainbowKitChains();
  const chainSearchThreshold = useChainSearchThreshold();
  const shouldShowSearch = rainbowkitChains.length > chainSearchThreshold;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredChains = rainbowkitChains.filter(({ id, name }) => {
    if (!shouldShowSearch || !normalizedSearchQuery) {
      return true;
    }

    return name?.toLowerCase().includes(normalizedSearchQuery) === true || String(id).includes(normalizedSearchQuery);
  });

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent
        bottomSheetOnMobile
        paddingBottom="0"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="14"
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            {mobile && <Box width="30" />}
            <Box
              paddingBottom="0"
              paddingLeft="8"
              paddingTop="4"
            >
              <Text
                as="h1"
                color="modalText"
                id={titleId}
                size={mobile ? "20" : "18"}
                weight="heavy"
              >
                {t("chains.title")}
              </Text>
            </Box>
            <CloseButton onClose={onClose} />
          </Box>
          {isConnectedToUnsupportedChain && (
            <Box
              marginX="8"
              textAlign={mobile ? "center" : "left"}
            >
              <Text
                color="modalTextSecondary"
                size="14"
                weight="medium"
              >
                {t("chains.wrong_network")}
              </Text>
            </Box>
          )}
          {shouldShowSearch && (
            <Box>
              <Box
                as="input"
                aria-label={t("chains.search.label")}
                autoComplete="off"
                className={SearchInputClassName}
                inputMode="search"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                placeholder={t("chains.search.placeholder")}
                type="search"
                name="network-search"
                value={searchQuery}
              />
            </Box>
          )}
          <Box
            className={mobile ? MobileScrollClassName : DesktopScrollClassName}
            display="flex"
            flexDirection="column"
            gap="4"
            padding="2"
            paddingBottom="16"
          >
            {filteredChains.map(({ iconBackground, iconUrl, id, name }, idx) => {
              return (
                <Chain
                  key={id}
                  chainId={id}
                  currentChainId={currentChainId}
                  switchChain={switchChain}
                  chainIconSize={chainIconSize}
                  isLoading={pendingChainId === id}
                  src={iconUrl}
                  name={name}
                  iconBackground={iconBackground}
                  showDivider={idx < filteredChains.length - 1}
                />
              );
            })}
            {filteredChains.length === 0 && (
              <Box
                marginX="8"
                paddingY="12"
                textAlign={mobile ? "center" : "left"}
              >
                <Text
                  color="modalTextSecondary"
                  size="14"
                  weight="medium"
                >
                  {t("chains.search.no_results")}
                </Text>
              </Box>
            )}
            {isConnectedToUnsupportedChain && (
              <>
                <Box
                  background="generalBorderDim"
                  height="1"
                  marginX="8"
                />
                <MenuButton
                  onClick={() => disconnect()}
                  testId="chain-option-disconnect"
                >
                  <Box
                    color="error"
                    fontFamily="body"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Box
                        alignItems="center"
                        display="flex"
                        flexDirection="row"
                        gap="4"
                        height={chainIconSize}
                      >
                        <Box
                          alignItems="center"
                          color="error"
                          height={chainIconSize}
                          justifyContent="center"
                          marginRight="8"
                        >
                          <DisconnectSqIcon size={Number(chainIconSize)} />
                        </Box>
                        <div>{t("chains.disconnect")}</div>
                      </Box>
                    </Box>
                  </Box>
                </MenuButton>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
