import React from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, radii } from "../../css/vars.stylex";

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderRadius: radii.actionButton,
    display: "flex",
    fontWeight: 600,
    justifyContent: "center",
    transitionDuration: "150ms",
    transitionProperty: "background-color, opacity",
    whiteSpace: "nowrap",
  },
  small: { fontSize: 14, height: 36, paddingInline: 14 },
  medium: { fontSize: 15, height: 44, paddingInline: 20 },
  large: { fontSize: 16, height: 48, paddingInline: 20 },
  primary: {
    backgroundColor: colors.accentColor,
    color: colors.accentColorForeground,
    opacity: { default: 1, ":hover": 0.9 },
  },
  secondary: {
    backgroundColor: { default: colors.actionButtonSecondaryBackground, ":hover": colors.profileActionHover },
    color: colors.modalText,
  },
  disabled: {
    backgroundColor: colors.actionButtonSecondaryBackground,
    color: colors.modalTextSecondary,
    pointerEvents: "none",
  },
  fullWidth: { width: "100%" },
});

export function ActionButton({
  disabled = false,
  fullWidth = false,
  href,
  label,
  onClick,
  size = "medium",
  testId,
  type = "primary",
}: {
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  label: string;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  testId?: string;
  type?: "primary" | "secondary";
}) {
  const props = {
    ...stylex.props(
      reset.button,
      styles.base,
      styles[size],
      disabled ? styles.disabled : styles[type],
      fullWidth && styles.fullWidth,
    ),
    "data-testid": testId ? `rk-${testId}` : undefined,
  };

  return href && !disabled ? (
    <a
      {...props}
      href={href}
      onClick={onClick}
      rel="noreferrer noopener"
      target="_blank"
    >
      {label}
    </a>
  ) : (
    <button
      {...props}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
