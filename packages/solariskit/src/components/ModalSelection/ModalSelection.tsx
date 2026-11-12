import React from "react";

import * as stylex from "@stylexjs/stylex";

import { AsyncImage } from "../AsyncImage/AsyncImage";
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
});

type Props = {
  onClick?: () => void;
  currentlySelected?: boolean;
  recent?: boolean;
  name: string;
  iconUrl: string | (() => Promise<string>);
  iconBackground?: string;
  testId?: string;
  isRainbowKitConnector?: boolean;
};

export const ModalSelection = ({
  currentlySelected = false,
  iconBackground,
  iconUrl,
  isRainbowKitConnector,
  name,
  onClick,
  recent,
  testId,
}: Props) => (
  <MenuButton
    currentlySelected={currentlySelected}
    onClick={onClick}
    testId={testId}
  >
    <AsyncImage
      background={iconBackground}
      radius={8}
      size={32}
      src={iconUrl}
      // EIP-6963 icons render more reliably as a plain <img />.
      useAsImage={!isRainbowKitConnector}
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
          Recent
        </Text>
      )}
    </span>
  </MenuButton>
);
