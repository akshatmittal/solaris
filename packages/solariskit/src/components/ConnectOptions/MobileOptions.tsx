import React, { useCallback, useContext, useEffect, useRef } from "react";

import { t } from "../../translations";
import { type WalletConnector, useWalletConnectors } from "../../wallets/useWalletConnectors";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Box } from "../Box/Box";
import { ActionButton } from "../Button/ActionButton";
import { CloseButton } from "../CloseButton/CloseButton";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { setWalletConnectDeepLink } from "../RainbowKitProvider/walletConnectDeepLink";
import { Text } from "../Text/Text";
import { GET_WALLET_URL } from "./constants";
import * as styles from "./MobileOptions.css";

const LoadingSpinner = ({ wallet }: { wallet: WalletConnector }) => {
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
          stroke: wallet?.iconAccent || "#0D3887",
        }}
      />
    </svg>
  );
};

export function WalletButton({
  onClose,
  wallet,
  connecting,
}: {
  wallet: WalletConnector;
  onClose: () => void;
  connecting?: boolean;
}) {
  const { connect, iconBackground, iconUrl, id, name, getMobileUri, ready, shortName, showWalletConnectModal } = wallet;

  const initialized = useRef(false);

  const onConnect = useCallback(async () => {
    const onMobileUri = async () => {
      const mobileUri = await getMobileUri?.();

      if (!mobileUri) return;

      if (mobileUri) {
        setWalletConnectDeepLink({ mobileUri, name });
      }

      if (mobileUri.startsWith("http")) {
        // Workaround for the upstream RainbowKit issue #524.
        // Using 'window.open' causes issues on iOS in non-Safari browsers and
        // WebViews where a blank tab is left behind after connecting.
        // This is especially bad in some WebView scenarios (e.g. following a
        // link from Twitter) where the user doesn't have any mechanism for
        // closing the blank tab.
        // For whatever reason, links with a target of "_blank" don't suffer
        // from this problem, and programmatically clicking a detached link
        // element with the same attributes also avoids the issue.
        const link = document.createElement("a");
        link.href = mobileUri;
        link.target = "_blank";
        link.rel = "noreferrer noopener";
        link.click();
      } else {
        window.location.href = mobileUri;
      }
    };

    if (id !== "walletConnect") onMobileUri();

    // If the id is "walletConnect" then "showWalletConnectModal" will always be true
    if (showWalletConnectModal) {
      showWalletConnectModal();
      onClose?.();
      return;
    }

    try {
      await connect?.();
    } catch {
      // Ignore connection errors so they don't surface as uncaught
    }
  }, [connect, getMobileUri, showWalletConnectModal, onClose, name, id]);

  useEffect(() => {
    // When using `reactStrictMode: true` in development mode the useEffect hook
    // will fire twice. We avoid this by using `useRef` logic here. Works for now.
    if (connecting && !initialized.current) {
      onConnect();
      initialized.current = true;
    }
  }, [connecting, onConnect]);

  return (
    <Box
      as="button"
      color={ready ? "modalText" : "modalTextSecondary"}
      disabled={!ready}
      fontFamily="body"
      key={id}
      onClick={onConnect}
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
          {connecting ? <LoadingSpinner wallet={wallet} /> : null}
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
              color={wallet.ready ? "modalText" : "modalTextSecondary"}
              size="13"
              weight="medium"
            >
              {/* Fix button text clipping in Safari: https://stackoverflow.com/questions/41100273/overflowing-button-text-is-being-clipped-in-safari */}
              <Box
                as="span"
                position="relative"
              >
                {shortName ?? name}
                {!wallet.ready && " (unsupported)"}
              </Box>
            </Text>

            {wallet.recent && (
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

export function MobileOptions({ onClose }: { onClose: () => void }) {
  const titleId = "rk_connect_title";
  const wallets = useWalletConnectors().filter((wallet) => wallet.isRainbowKitConnector);
  const { disclaimer: Disclaimer, learnMoreUrl } = useContext(AppContext);

  const headerLabel = t("connect.title");
  const headerBackgroundContrast = true;
  const walletContent = (
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
        {wallets
          .filter((wallet) => wallet.ready)
          .map((wallet) => {
            return (
              <Box
                key={wallet.id}
                width="60"
              >
                <WalletButton
                  onClose={onClose}
                  wallet={wallet}
                />
              </Box>
            );
          })}
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
            href={GET_WALLET_URL}
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
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingBottom="36"
    >
      {/* header section */}
      <Box
        background={headerBackgroundContrast ? "profileForeground" : "modalBackground"}
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
              {headerLabel}
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
        {walletContent}
      </Box>
    </Box>
  );
}
