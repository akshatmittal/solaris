import React from "react";

import { touchableStyles } from "../../css/touchableStyles";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box } from "../Box/Box";
import { SpinnerIcon } from "../Icons/Spinner";
import * as styles from "./WalletButton.css";

export interface WalletButtonViewConnector {
  iconBackground?: string;
  iconUrl?: string | (() => Promise<string>);
  id: string;
  name: string;
}

export interface WalletButtonViewProps {
  connected: boolean;
  connector: WalletButtonViewConnector;
  loading: boolean;
  mounted: boolean;
  onConnect: () => void | Promise<void>;
  ready: boolean;
}

export function WalletButtonView({ connected, connector, loading, mounted, onConnect, ready }: WalletButtonViewProps) {
  const isDisabled = !ready || loading;

  if (!mounted) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      disabled={isDisabled}
      pointerEvents={isDisabled ? "none" : "all"}
    >
      <Box
        as="button"
        borderRadius="menuButton"
        borderStyle="solid"
        borderWidth="1"
        className={[
          styles.maxWidth,
          styles.border,
          touchableStyles({
            active: "shrink",
            hover: "grow",
          }),
        ]}
        minHeight="44"
        onClick={onConnect}
        disabled={!ready || loading}
        padding="6"
        style={{ willChange: "transform" }}
        testId={`wallet-button-${connector.id}`}
        transition="default"
        width="full"
        background="connectButtonBackground"
      >
        <Box
          color="modalText"
          fontFamily="body"
          fontSize="16"
          fontWeight="bold"
          transition="default"
          display="flex"
          alignItems="center"
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            gap="12"
            paddingRight="6"
          >
            <Box>
              {loading ? (
                <SpinnerIcon />
              ) : (
                <AsyncImage
                  background={connector.iconBackground}
                  borderRadius="6"
                  height="28"
                  src={connector.iconUrl}
                  width="28"
                />
              )}
            </Box>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              color="modalText"
            >
              <Box testId={`wallet-button-label-${connector.id}`}>
                {loading
                  ? t("connect.status.connecting", {
                      wallet: connector.name,
                    })
                  : connector.name}
              </Box>
            </Box>

            {connected ? (
              <Box
                background="connectionIndicator"
                borderColor="selectedOptionBorder"
                borderRadius="full"
                borderStyle="solid"
                borderWidth="1"
                height="8"
                width="8"
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
