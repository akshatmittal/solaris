import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors } from "../../css/vars.stylex";

const styles = stylex.create({
  button: {
    alignItems: "center",
    backgroundColor: { default: "transparent", ":hover": colors.closeButtonBackground },
    borderRadius: 9999,
    color: { default: colors.closeButton, ":hover": colors.modalText },
    display: "flex",
    flexShrink: 0,
    height: 32,
    justifyContent: "center",
    transitionDuration: "150ms",
    transitionProperty: "background-color, color",
    width: 32,
  },
});

export function IconButton({
  "aria-label": ariaLabel,
  children,
  onClick,
}: {
  "aria-label": string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      {...stylex.props(reset.button, styles.button)}
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
