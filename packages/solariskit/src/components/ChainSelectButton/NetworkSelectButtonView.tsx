import React from "react";

import type { ChainStatus } from "./ChainSelectButton";

import { type ResponsiveValue, mapResponsiveValue } from "../../css/sprinkles.css";
import { touchableStyles } from "../../css/touchableStyles";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box } from "../Box/Box";
import { DropdownIcon } from "../Icons/Dropdown";

export interface NetworkSelectButtonNetwork {
  hasIcon: boolean;
  iconBackground?: string;
  iconUrl?: string;
  id: number | string;
  name?: string;
  unsupported?: boolean;
}

export interface NetworkSelectButtonViewProps {
  buttonReady: boolean;
  chainStatus: ResponsiveValue<ChainStatus>;
  network?: NetworkSelectButtonNetwork;
  networkCount: number;
  onOpenNetworkModal?: () => void;
  /** Distinguishes testIds when multiple ecosystems render this view on one page. */
  testIdPrefix?: string;
}

export const defaultNetworkSelectChainStatus = { largeScreen: "full", smallScreen: "icon" } as const;

export function NetworkSelectButtonView({
  buttonReady,
  chainStatus,
  network,
  networkCount,
  onOpenNetworkModal,
  testIdPrefix = "",
}: NetworkSelectButtonViewProps) {
  const unsupportedNetwork = network?.unsupported ?? false;

  if (!network || (networkCount <= 1 && !unsupportedNetwork)) {
    return null;
  }

  return (
    <Box
      alignItems="center"
      aria-label="Chain Selector"
      as="button"
      background={unsupportedNetwork ? "connectButtonBackgroundError" : "connectButtonBackground"}
      borderRadius="connectButton"
      boxShadow="connectButton"
      className={touchableStyles({
        active: "shrink",
        hover: "grow",
      })}
      color={unsupportedNetwork ? "connectButtonTextError" : "connectButtonText"}
      disabled={!buttonReady || !onOpenNetworkModal}
      display={mapResponsiveValue(chainStatus, (value) => (value === "none" ? "none" : "flex"))}
      fontFamily="body"
      fontWeight="bold"
      gap="6"
      justifyContent="center"
      key={unsupportedNetwork ? "unsupported" : "supported"}
      onClick={buttonReady ? onOpenNetworkModal : undefined}
      paddingX="10"
      paddingY="8"
      testId={`${testIdPrefix}${unsupportedNetwork ? "wrong-network-button" : "chain-button"}`}
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
      {unsupportedNetwork ? (
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
          {network.hasIcon ? (
            <Box
              display={mapResponsiveValue(chainStatus, (value) =>
                value === "full" || value === "icon" ? "block" : "none",
              )}
              height="24"
              width="24"
            >
              <AsyncImage
                alt={network.name ?? "Chain icon"}
                background={network.iconBackground}
                borderRadius="full"
                height="24"
                src={network.iconUrl}
                width="24"
              />
            </Box>
          ) : null}
          <Box
            display={mapResponsiveValue(chainStatus, (value) => {
              if (value === "icon" && !network.iconUrl) {
                return "block";
              }

              return value === "full" || value === "name" ? "block" : "none";
            })}
          >
            {network.name ?? network.id}
          </Box>
        </Box>
      )}
      <DropdownIcon />
    </Box>
  );
}
