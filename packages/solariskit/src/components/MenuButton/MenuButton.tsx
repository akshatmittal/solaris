import React from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, media, motion, radii } from "../../css/vars.stylex";

const styles = stylex.create({
  row: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": { default: null, [media.hover]: colors.menuItemBackground },
      ":active": {
        default: `color-mix(in srgb, ${colors.menuItemBackground} 85%, currentColor)`,
        [media.hover]: `color-mix(in srgb, ${colors.menuItemBackground} 85%, currentColor)`,
      },
    },
    borderRadius: radii.menuButton,
    color: colors.modalText,
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    gap: 12,
    lineHeight: "22px",
    minHeight: 48,
    outlineOffset: -2,
    paddingBlock: 8,
    paddingInline: 12,
    transitionDuration: motion.fast,
    transitionProperty: "background-color",
    transitionTimingFunction: motion.easeOut,
    width: "100%",
  },
  selected: {
    backgroundColor: colors.accentSoft,
  },
  danger: {
    color: colors.error,
  },
});

export function MenuButton({
  busy,
  children,
  currentlySelected = false,
  danger = false,
  disabled,
  onClick,
}: {
  busy: boolean;
  children: React.ReactNode;
  currentlySelected?: boolean;
  danger?: boolean;
  disabled: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      {...stylex.props(reset.button, styles.row, currentlySelected && styles.selected, danger && styles.danger)}
      aria-busy={busy || undefined}
      aria-current={currentlySelected || undefined}
      disabled={currentlySelected || disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
