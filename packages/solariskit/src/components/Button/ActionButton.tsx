import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media, radii } from "../../css/vars.stylex";
import { SpinnerIcon } from "../Icons/Spinner";

const styles = stylex.create({
  base: {
    alignItems: "center",
    borderRadius: radii.actionButton,
    display: "flex",
    fontWeight: 600,
    gap: 6,
    justifyContent: "center",
    position: "relative",
    whiteSpace: "nowrap",
  },
  hiddenLabel: {
    alignItems: "center",
    display: "flex",
    gap: 6,
    opacity: 0,
  },
  spinner: {
    alignItems: "center",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
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
  loading: {
    pointerEvents: "none",
  },
  fullWidth: { width: "100%" },
});

export function ActionButton({
  disabled = false,
  fullWidth = false,
  href,
  icon,
  label,
  loading = false,
  onClick,
  size = "medium",
  type = "primary",
}: {
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  icon?: ReactNode;
  label: string;
  loading?: boolean;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  type?: "primary" | "secondary";
}) {
  const props = stylex.props(
    reset.button,
    styles.base,
    styles[size],
    disabled ? styles.disabled : styles[type],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    press.scale,
  );
  const content = (
    <>
      {icon}
      {label}
    </>
  );

  return href && !disabled && !loading ? (
    <a
      {...props}
      href={href}
      onClick={onClick}
      rel="noreferrer noopener"
      target="_blank"
    >
      {content}
    </a>
  ) : (
    <button
      {...props}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      disabled={disabled}
      onClick={loading ? undefined : onClick}
      type="button"
    >
      {loading ? (
        <>
          <span {...stylex.props(styles.hiddenLabel)}>{content}</span>
          <span
            {...stylex.props(styles.spinner)}
            aria-hidden
          >
            <SpinnerIcon
              height={16}
              width={16}
            />
          </span>
        </>
      ) : (
        content
      )}
    </button>
  );
}
