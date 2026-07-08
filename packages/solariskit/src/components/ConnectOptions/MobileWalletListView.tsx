import React, { type ReactNode, useContext } from "react";

import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box } from "../Box/Box";
import { ActionButton } from "../Button/ActionButton";
import { CloseButton } from "../CloseButton/CloseButton";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import * as styles from "./MobileOptions.css";

const LoadingSpinner = ({ accent }: { accent?: string }) => {
  const width = 80;
  const height = 80;
  const radiusFactor = 20;

  const perimeter = 2 * (width + height - 4 * radiusFactor);

  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 86 86"
      width="86"
      height="86"
    >
      <title>Loading</title>
      <rect
        x="3"
        y="3"
        width={width}
        height={height}
        rx={radiusFactor}
        ry={radiusFactor}
        strokeDasharray={`${perimeter / 3} ${(2 * perimeter) / 3}`}
        strokeDashoffset={perimeter} // Adjust this value as per your design needs
        className={styles.rotatingBorder}
        style={{
          // Prop style passing works only in `@vanilla-extract/recipes`.
          // Instead downloading packages we can do this
          // manually without passing props
          stroke: accent || "#0D3887",
        }}
      />
    </svg>
  );
};

export interface MobileWalletItemViewProps {
  connecting?: boolean;
  iconAccent?: string;
  iconBackground?: string;
  iconUrl: string | (() => Promise<string>);
  id: string;
  name: string;
  onClick: () => void;
  ready?: boolean;
  recent?: boolean;
  shortName?: string;
}

export function MobileWalletItemView({
  connecting,
  iconAccent,
  iconBackground,
  iconUrl,
  id,
  name,
  onClick,
  ready,
  recent,
  shortName,
}: MobileWalletItemViewProps) {
  return (
    <Box
      as="button"
      color={ready ? "modalText" : "modalTextSecondary"}
      disabled={!ready}
      fontFamily="body"
      key={id}
      onClick={onClick}
      style={{ overflow: "visible", textAlign: "center" }}
      testId={`wallet-option-${id}`}
      type="button"
      width="full"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingBottom="8"
          paddingTop="10"
          position="relative"
        >
          {connecting ? <LoadingSpinner accent={iconAccent} /> : null}
          <AsyncImage
            background={iconBackground}
            borderRadius="13"
            boxShadow="walletLogo"
            height="60"
            src={iconUrl}
            width="60"
          />
        </Box>
        {!connecting ? (
          <Box
            display="flex"
            flexDirection="column"
            textAlign="center"
          >
            <Text
              as="h2"
              color={ready ? "modalText" : "modalTextSecondary"}
              size="13"
              weight="medium"
            >
              {/* Fix button text clipping in Safari: https://stackoverflow.com/questions/41100273/overflowing-button-text-is-being-clipped-in-safari */}
              <Box
                as="span"
                position="relative"
              >
                {shortName ?? name}
                {!ready && " (unsupported)"}
              </Box>
            </Text>

            {recent && (
              <Text
                color="accentColor"
                size="12"
                weight="medium"
              >
                {t("connect.recent")}
              </Text>
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export interface MobileWalletListViewProps {
  getWalletUrl: string;
  onClose: () => void;
  titleId: string;
  walletItems: ReactNode;
}

/**
 * Chain-agnostic mobile connect sheet: title header, horizontally scrolling
 * wallet row, intro copy, get-wallet/learn-more actions, and the optional
 * disclaimer. The EVM MobileOptions and the Solana connect modal both
 * parameterize this view.
 */
export function MobileWalletListView({ getWalletUrl, onClose, titleId, walletItems }: MobileWalletListViewProps) {
  const { disclaimer: Disclaimer, learnMoreUrl } = useContext(AppContext);

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingBottom="36"
    >
      {/* header section */}
      <Box
        background="profileForeground"
        display="flex"
        flexDirection="column"
        paddingBottom="4"
        paddingTop="14"
      >
        <Box
          display="flex"
          justifyContent="center"
          paddingBottom="6"
          paddingX="20"
          position="relative"
        >
          <Box
            marginTop="4"
            textAlign="center"
            width="full"
          >
            <Text
              as="h1"
              color="modalText"
              id={titleId}
              size="20"
              weight="bold"
            >
              {t("connect.title")}
            </Text>
          </Box>

          <Box
            alignItems="center"
            display="flex"
            height="32"
            paddingRight="14"
            position="absolute"
            right="0"
          >
            <Box
              style={{ marginBottom: -20, marginTop: -20 }} // Vertical bleed
            >
              <CloseButton onClose={onClose} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
      >
        <Box>
          <Box
            background="profileForeground"
            className={styles.scroll}
            display="flex"
            paddingBottom="20"
            paddingTop="6"
            paddingX="20"
            style={{
              gap: "calc((100% - 40px - 240px + 47px) / 4)",
            }}
          >
            {walletItems}
          </Box>

          <Box
            background="generalBorder"
            height="1"
            marginBottom="32"
            marginTop="-1"
          />

          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            gap="32"
            paddingX="32"
            style={{ textAlign: "center" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap="8"
              textAlign="center"
            >
              <Text
                color="modalText"
                size="16"
                weight="bold"
              >
                {t("intro.title")}
              </Text>
              <Text
                color="modalTextSecondary"
                size="16"
              >
                {t("intro.description")}
              </Text>
            </Box>
          </Box>

          <Box
            paddingTop="32"
            paddingX="20"
          >
            <Box
              display="flex"
              gap="14"
              justifyContent="center"
            >
              <ActionButton
                href={getWalletUrl}
                label={t("intro.get.label")}
                size="large"
                type="secondary"
              />
              <ActionButton
                href={learnMoreUrl}
                label={t("intro.learn_more.label")}
                size="large"
                type="secondary"
              />
            </Box>
          </Box>
          {Disclaimer && (
            <Box
              marginTop="28"
              marginX="32"
              textAlign="center"
            >
              <Disclaimer
                Link={DisclaimerLink}
                Text={DisclaimerText}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
