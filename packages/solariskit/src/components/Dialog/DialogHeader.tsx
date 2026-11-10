import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

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
  start: {
    gridTemplateColumns: "1fr 32px",
  },
});

export function DialogHeader({
  align = "center",
  left,
  onClose,
  size = "18",
  testId,
  title,
  titleId,
}: {
  align?: "center" | "start";
  left?: ReactNode;
  onClose?: () => void;
  size?: "17" | "18";
  testId?: string;
  title?: ReactNode;
  titleId?: string;
}) {
  return (
    <div {...stylex.props(styles.header, align === "start" && styles.start)}>
      {align === "center" && <div>{left}</div>}
      {title ? (
        <Text
          align={align === "start" ? "left" : "center"}
          as="h1"
          color="modalText"
          id={titleId}
          size={size}
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
          aria-label="Close"
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
