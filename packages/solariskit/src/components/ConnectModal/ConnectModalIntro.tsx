import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { ActionButton } from "../Button/ActionButton";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { KeyIcon, WalletIcon } from "../Icons/FeatureIcons";
import { IconTile } from "../Icons/IconTile";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
    width: "100%",
  },
  containerCompact: {
    maxWidth: 320,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  feature: {
    alignItems: "flex-start",
    display: "flex",
    gap: 16,
  },
  featureText: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  actionsWide: {
    flexDirection: "row",
    gap: 16,
  },
  disclaimer: {
    textAlign: "center",
  },
});

function Feature({ description, icon, title }: { description: string; icon: ReactNode; title: string }) {
  return (
    <div {...stylex.props(styles.feature)}>
      <IconTile>{icon}</IconTile>
      <div {...stylex.props(styles.featureText)}>
        <Text
          color="modalText"
          size="15"
          weight="semibold"
        >
          {title}
        </Text>
        <Text
          color="modalTextSecondary"
          size="14"
          weight="regular"
        >
          {description}
        </Text>
      </div>
    </div>
  );
}

export function ConnectModalIntro({ compact, getWallet }: { compact: boolean; getWallet: () => void }) {
  const { disclaimer: Disclaimer, learnMoreUrl } = useContext(AppContext);

  return (
    <div {...stylex.props(styles.container, compact && styles.containerCompact)}>
      <div {...stylex.props(styles.features)}>
        <Feature
          description={t("intro.digital_asset.description")}
          icon={<WalletIcon />}
          title={t("intro.digital_asset.title")}
        />
        <Feature
          description={t("intro.login.description")}
          icon={<KeyIcon />}
          title={t("intro.login.title")}
        />
      </div>
      <div {...stylex.props(styles.actions, !compact && styles.actionsWide)}>
        <ActionButton
          fullWidth={compact}
          label={t("intro.get.label")}
          onClick={getWallet}
        />
        <TextLink
          href={learnMoreUrl}
          tall
        >
          {t("intro.learn_more.label")}
        </TextLink>
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
