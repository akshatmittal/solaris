import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/Close";
import { Text } from "../Text/Text";

const styles = stylex.create({
  header: {
    alignItems: "center",
    display: "grid",
    gap: 8,
    gridTemplateColumns: "32px 1fr 32px",
    minHeight: 32,
  },
});

export function DialogHeader({
  left,
  onClose,
  testId,
  title,
  titleId,
}: {
  left?: ReactNode;
  onClose?: () => void;
  testId?: string;
  title?: ReactNode;
  titleId?: string;
}) {
  return (
    <div {...stylex.props(styles.header)}>
      <div>{left}</div>
      {title ? (
        <Text
          align="center"
          as="h1"
          color="modalText"
          id={titleId}
          size="18"
          testId={testId}
          weight="semibold"
        >
          {title}
        </Text>
      ) : (
        <div />
      )}
      {onClose ? (
        <IconButton
          aria-label={t("common.close")}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : (
        <div />
      )}
    </div>
  );
}
