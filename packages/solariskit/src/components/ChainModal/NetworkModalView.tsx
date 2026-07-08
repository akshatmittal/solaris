import React, { Fragment, useEffect, useState } from "react";

import type { AsyncImageSrc } from "../AsyncImage/useAsyncImage";

import { t } from "../../translations";
import { isMobile } from "../../utils/isMobile";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box, type BoxProps } from "../Box/Box";
import { CloseButton } from "../CloseButton/CloseButton";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { DisconnectSqIcon } from "../Icons/DisconnectSq";
import { MenuButton } from "../MenuButton/MenuButton";
import { Text } from "../Text/Text";
import { DesktopScrollClassName, MobileScrollClassName, SearchInputClassName } from "./ChainModal.css";

export type NetworkModalId = number | string;

export interface NetworkModalItem {
  iconBackground?: string;
  iconUrl?: string | AsyncImageSrc | null;
  id: NetworkModalId;
  name?: string;
}

interface NetworkMenuItemProps {
  chainIconSize: BoxProps["height"];
  currentNetworkId?: NetworkModalId;
  iconBackground?: string;
  isLoading: boolean;
  name?: string;
  networkId: NetworkModalId;
  onSelectNetwork: (networkId: NetworkModalId) => void;
  showDivider: boolean;
  src?: string | AsyncImageSrc | null;
}

function NetworkMenuItem({
  chainIconSize,
  currentNetworkId,
  iconBackground,
  isLoading,
  name,
  networkId,
  onSelectNetwork,
  showDivider,
  src,
}: NetworkMenuItemProps) {
  const mobile = isMobile();
  const isCurrentNetwork = currentNetworkId === networkId;

  return (
    <Fragment>
      <MenuButton
        currentlySelected={isCurrentNetwork}
        onClick={isCurrentNetwork ? undefined : () => onSelectNetwork(networkId)}
        testId={`chain-option-${String(networkId)}`}
      >
        <Box
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
              {src && (
                <Box
                  height="full"
                  marginRight="8"
                >
                  <AsyncImage
                    alt={name}
                    background={iconBackground}
                    borderRadius="full"
                    height={chainIconSize}
                    src={src}
                    width={chainIconSize}
                    testId={`chain-option-${String(networkId)}-icon`}
                  />
                </Box>
              )}
              <div>{name ?? networkId}</div>
            </Box>
            {isCurrentNetwork && (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                marginRight="6"
              >
                <Text
                  color="accentColorForeground"
                  size="14"
                  weight="medium"
                >
                  {t("chains.connected")}
                </Text>
                <Box
                  background="connectionIndicator"
                  borderColor="selectedOptionBorder"
                  borderRadius="full"
                  borderStyle="solid"
                  borderWidth="1"
                  height="8"
                  marginLeft="8"
                  width="8"
                />
              </Box>
            )}
            {isLoading && (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                marginRight="6"
              >
                <Text
                  color="modalText"
                  size="14"
                  weight="medium"
                >
                  {t("chains.confirm")}
                </Text>
                <Box
                  background="standby"
                  borderRadius="full"
                  height="8"
                  marginLeft="8"
                  width="8"
                />
              </Box>
            )}
          </Box>
        </Box>
      </MenuButton>
      {mobile && showDivider && (
        <Box
          background="generalBorderDim"
          height="1"
          marginX="8"
        />
      )}
    </Fragment>
  );
}

export interface NetworkModalViewProps {
  currentNetworkId?: NetworkModalId;
  isConnectedToUnsupportedNetwork?: boolean;
  networks: NetworkModalItem[];
  onClose: () => void;
  onDisconnectUnsupported?: () => void;
  onSelectNetwork: (networkId: NetworkModalId) => void;
  open: boolean;
  pendingNetworkId?: NetworkModalId | null;
  searchThreshold: number;
}

export function NetworkModalView({
  currentNetworkId,
  isConnectedToUnsupportedNetwork = false,
  networks,
  onClose,
  onDisconnectUnsupported,
  onSelectNetwork,
  open,
  pendingNetworkId,
  searchThreshold,
}: NetworkModalViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // useId keeps the heading id unique when several ecosystems (EVM + Solana)
  // mount their network modals on the same page.
  const titleId = `rk_chain_modal_title_${React.useId()}`;
  const mobile = isMobile();
  const chainIconSize = mobile ? "36" : "28";
  const shouldShowSearch = networks.length > searchThreshold;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredNetworks = networks.filter(({ id, name }) => {
    if (!shouldShowSearch || !normalizedSearchQuery) {
      return true;
    }

    return (
      name?.toLowerCase().includes(normalizedSearchQuery) === true ||
      String(id).toLowerCase().includes(normalizedSearchQuery)
    );
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
          {isConnectedToUnsupportedNetwork && (
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
            {filteredNetworks.map(({ iconBackground, iconUrl, id, name }, idx) => (
              <NetworkMenuItem
                key={String(id)}
                chainIconSize={chainIconSize}
                currentNetworkId={currentNetworkId}
                iconBackground={iconBackground}
                isLoading={pendingNetworkId === id}
                name={name}
                networkId={id}
                onSelectNetwork={onSelectNetwork}
                showDivider={idx < filteredNetworks.length - 1}
                src={iconUrl}
              />
            ))}
            {filteredNetworks.length === 0 && (
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
            {isConnectedToUnsupportedNetwork && onDisconnectUnsupported && (
              <>
                <Box
                  background="generalBorderDim"
                  height="1"
                  marginX="8"
                />
                <MenuButton
                  onClick={onDisconnectUnsupported}
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
