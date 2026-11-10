import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { WalletIcon } from "../Icons/FeatureIcons";
import { IconTile } from "../Icons/IconTile";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const styles = stylex.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: 280,
    textAlign: "center",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 20,
  },
  link: {
    alignItems: "center",
    display: "flex",
    gap: 6,
    marginTop: 16,
  },
  disclaimer: {
    marginTop: 24,
  },
});

export function ConnectModalIntro({ getWalletUrl }: { getWalletUrl: string }) {
  const { disclaimer: Disclaimer } = useContext(AppContext);

  return (
    <div {...stylex.props(styles.container)}>
      <IconTile>
        <WalletIcon size={28} />
      </IconTile>
      <div {...stylex.props(styles.text)}>
        <Text
          as="h2"
          color="modalText"
          size="18"
          weight="semibold"
        >
          {t("intro.title")}
        </Text>
        <Text
          as="p"
          color="modalTextSecondary"
          size="14"
          weight="regular"
        >
          {t("intro.description")}
        </Text>
      </div>
      <div {...stylex.props(styles.link)}>
        <Text
          color="modalTextSecondary"
          size="14"
          weight="regular"
        >
          {t("connect.new_to_ethereum.description")}
        </Text>
        <TextLink href={getWalletUrl}>{t("intro.get.label")}</TextLink>
      </div>
      {Disclaimer && (
        <div {...stylex.props(styles.disclaimer)}>
          <Disclaimer
            Link={DisclaimerLink}
            Text={DisclaimerText}
          />
        </div>
      )}
    </div>
  );
}
