import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media } from "../../css/vars.stylex";

const styles = stylex.create({
  button: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [media.hover]: colors.closeButtonBackground },
    },
    borderRadius: 9999,
    color: { default: colors.closeButton, ":hover": { default: null, [media.hover]: colors.modalText } },
    display: "flex",
    flexShrink: 0,
    height: 32,
    justifyContent: "center",
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
      {...stylex.props(reset.button, styles.button, press.scale)}
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
