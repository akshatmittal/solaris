import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { ActionButton } from "../Button/ActionButton";
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
    gap: 4,
    paddingBottom: 4,
    paddingInline: 12,
    paddingTop: 12,
    textAlign: "center",
    width: "100%",
  },
  // Without the actions, the sheet footer follows directly.
  noActions: {
    paddingBottom: 24,
  },
  icon: {
    marginBottom: 12,
  },
  actions: {
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 20,
  },
});

export function WalletListEmptyState({
  getWalletUrl,
  showAction = true,
}: {
  getWalletUrl: string;
  showAction?: boolean;
}) {
  const { learnMoreUrl } = useContext(AppContext);

  return (
    <div
      {...stylex.props(styles.container, !showAction && styles.noActions)}
      role="status"
    >
      <div {...stylex.props(styles.icon)}>
        <IconTile>
          <WalletIcon size={28} />
        </IconTile>
      </div>
      <Text
        as="h2"
        color="modalText"
        size="18"
        weight="semibold"
      >
        {t("connect.empty.title")}
      </Text>
      <Text
        as="p"
        color="modalTextSecondary"
        size="14"
        weight="regular"
      >
        {t("connect.empty.description")}
      </Text>
      {showAction ? (
        <div {...stylex.props(styles.actions)}>
          <ActionButton
            fullWidth
            href={getWalletUrl}
            label={t("intro.get.label")}
          />
          <TextLink
            href={learnMoreUrl}
            tall
          >
            {t("intro.learn_more.label")}
          </TextLink>
        </div>
      ) : null}
    </div>
  );
}
