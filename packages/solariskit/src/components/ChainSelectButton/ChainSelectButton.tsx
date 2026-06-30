import React, { useEffect, useState } from "react";

import { useConfig, useConnection } from "wagmi";

import { type ResponsiveValue, mapResponsiveValue } from "../../css/sprinkles.css";
import { touchableStyles } from "../../css/touchableStyles";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useSelectedChainId } from "../../hooks/useSelectedChainId";
import { t } from "../../translations";
import { isChainIdSupported } from "../../utils/isChainIdSupported";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { Box } from "../Box/Box";
import { DropdownIcon } from "../Icons/Dropdown";
import { useChainModal } from "../RainbowKitProvider/ModalContext";
import { useRainbowKitChains, useRainbowKitChainsById } from "../RainbowKitProvider/RainbowKitChainContext";

export type ChainStatus = "full" | "icon" | "name" | "none";

export interface ChainSelectButtonProps {
  chainStatus?: ResponsiveValue<ChainStatus>;
}

const defaultProps = {
  chainStatus: { largeScreen: "full", smallScreen: "icon" },
} as const;

export function ChainSelectButton({ chainStatus = defaultProps.chainStatus }: ChainSelectButtonProps) {
  const chains = useRainbowKitChains();
  const chainsById = useRainbowKitChainsById();
  const connectionStatus = useConnectionStatus();
  const { openChainModal } = useChainModal();
  const { chainId: connectedChainId } = useConnection();
  const chainId = useSelectedChainId(connectedChainId);
  const { chains: wagmiChains } = useConfig();
  const isConnectedChainSupported = connectedChainId ? isChainIdSupported(wagmiChains, connectedChainId) : true;
  const isMounted = useIsMounted();
  const [ready, setReady] = useState(false);
  const chainMetadata = chainId ? chainsById[chainId] : undefined;
  const resolvedChainIconUrl = useAsyncImage(chainMetadata?.iconUrl ?? undefined);
  const chain = chainId
    ? {
        hasIcon: Boolean(chainMetadata?.iconUrl),
        iconBackground: chainMetadata?.iconBackground,
        iconUrl: resolvedChainIconUrl,
        id: chainId,
        name: chainMetadata?.name ?? undefined,
        unsupported: !isConnectedChainSupported,
      }
    : undefined;

  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);

  if (!ready) {
    return null;
  }

  const buttonReady = isMounted() && connectionStatus !== "loading";
  const unsupportedChain = chain?.unsupported ?? false;

  if (!chain || (chains.length <= 1 && !unsupportedChain)) {
    return null;
  }

  return (
    <Box
      alignItems="center"
      aria-label="Chain Selector"
      as="button"
      background={unsupportedChain ? "connectButtonBackgroundError" : "connectButtonBackground"}
      borderRadius="connectButton"
      boxShadow="connectButton"
      className={touchableStyles({
        active: "shrink",
        hover: "grow",
      })}
      color={unsupportedChain ? "connectButtonTextError" : "connectButtonText"}
      disabled={!buttonReady || !openChainModal}
      display={mapResponsiveValue(chainStatus, (value) => (value === "none" ? "none" : "flex"))}
      fontFamily="body"
      fontWeight="bold"
      gap="6"
      key={
        // Force re-mount to prevent CSS transition
        unsupportedChain ? "unsupported" : "supported"
      }
      onClick={buttonReady ? openChainModal : undefined}
      paddingX="10"
      paddingY="8"
      testId={unsupportedChain ? "wrong-network-button" : "chain-button"}
      transition="default"
      type="button"
      {...(!buttonReady && {
        "aria-hidden": true,
        style: {
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
        },
      })}
    >
      {unsupportedChain ? (
        <Box
          alignItems="center"
          display="flex"
          height="24"
          paddingX="4"
        >
          {t("connect_wallet.wrong_network.label")}
        </Box>
      ) : (
        <Box
          alignItems="center"
          display="flex"
          gap="6"
        >
          {chain.hasIcon ? (
            <Box
              display={mapResponsiveValue(chainStatus, (value) =>
                value === "full" || value === "icon" ? "block" : "none",
              )}
              height="24"
              width="24"
            >
              <AsyncImage
                alt={chain.name ?? "Chain icon"}
                background={chain.iconBackground}
                borderRadius="full"
                height="24"
                src={chain.iconUrl}
                width="24"
              />
            </Box>
          ) : null}
          <Box
            display={mapResponsiveValue(chainStatus, (value) => {
              if (value === "icon" && !chain.iconUrl) {
                return "block";
              }

              return value === "full" || value === "name" ? "block" : "none";
            })}
          >
            {chain.name ?? chain.id}
          </Box>
        </Box>
      )}
      <DropdownIcon />
    </Box>
  );
}

ChainSelectButton.__defaultProps = defaultProps;
