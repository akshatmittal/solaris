import React from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media, radii } from "../../css/vars.stylex";

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderRadius: radii.actionButton,
    display: "flex",
    fontWeight: 600,
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
  small: { fontSize: 14, height: 36, paddingInline: 14 },
  medium: { fontSize: 15, height: 44, paddingInline: 20 },
  large: {
    fontSize: { default: 16, [media.largeScreen]: 15 },
    height: { default: 48, [media.largeScreen]: 44 },
    paddingInline: 20,
  },
  primary: {
    backgroundColor: colors.accentColor,
    color: colors.accentColorForeground,
    opacity: { default: 1, ":hover": { default: null, [media.hover]: 0.9 } },
  },
  secondary: {
    backgroundColor: {
      default: colors.actionButtonSecondaryBackground,
      ":hover": { default: null, [media.hover]: colors.profileActionHover },
    },
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
      press.scale,
    ),
    "data-testid": testId ? `solaris-${testId}` : undefined,
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
