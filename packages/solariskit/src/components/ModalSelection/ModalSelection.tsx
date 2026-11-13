import React from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { SpinnerIcon } from "../Icons/Spinner";
import { MenuButton } from "../MenuButton/MenuButton";
import { Text } from "../Text/Text";

const styles = stylex.create({
  label: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    textAlign: "left",
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  spinner: {
    color: colors.accentColor,
    display: "flex",
    marginInlineStart: "auto",
  },
});

type Props = {
  onClick?: () => void;
  currentlySelected?: boolean;
  recent?: boolean;
  name: string;
  iconUrl: string | (() => Promise<string>);
  iconBackground?: string;
  isSolarisConnector?: boolean;
  // The wallet SDK loads; the row cannot be selected.
  loading: boolean;
  // The wallet connects; the row stays selectable, so the user can reopen or repeat it.
  connecting: boolean;
};

export const ModalSelection = ({
  connecting,
  currentlySelected = false,
  iconBackground,
  iconUrl,
  isSolarisConnector,
  loading,
  name,
  onClick,
  recent,
}: Props) => (
  <MenuButton
    busy={loading || connecting}
    currentlySelected={currentlySelected}
    disabled={loading}
    onClick={onClick}
  >
    <AsyncImage
      background={iconBackground}
      radius={8}
      size={32}
      src={iconUrl}
      // EIP-6963 icons render more reliably as a plain <img />.
      useAsImage={!isSolarisConnector}
    />
    <span {...stylex.props(styles.label)}>
      <span {...stylex.props(styles.name)}>{name}</span>
      {recent && (
        <Text
          as="span"
          color="modalTextSecondary"
          size="12"
          weight="medium"
        >
          {t("connect.recent")}
        </Text>
      )}
    </span>
    {(loading || connecting) && (
      <span {...stylex.props(styles.spinner)}>
        <SpinnerIcon />
      </span>
    )}
  </MenuButton>
);
