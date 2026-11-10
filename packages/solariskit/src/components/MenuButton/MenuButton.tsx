import React from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, radii } from "../../css/vars.stylex";

const styles = stylex.create({
  row: {
    alignItems: "center",
    backgroundColor: { default: "transparent", ":hover": colors.menuItemBackground },
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
    transitionDuration: "120ms",
    transitionProperty: "background-color",
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
  children,
  currentlySelected = false,
  danger = false,
  onClick,
  testId,
}: {
  children: React.ReactNode;
  currentlySelected?: boolean;
  danger?: boolean;
  onClick?: () => void;
  testId?: string;
}) {
  return (
    <button
      {...stylex.props(reset.button, styles.row, currentlySelected && styles.selected, danger && styles.danger)}
      aria-current={currentlySelected || undefined}
      data-testid={testId ? `rk-${testId}` : undefined}
      disabled={currentlySelected}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
