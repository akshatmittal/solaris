import React from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors } from "../../css/vars.stylex";

const colorStyles = stylex.create({
  accentColor: { color: colors.accentColor },
  accentColorForeground: { color: colors.accentColorForeground },
  closeButton: { color: colors.closeButton },
  error: { color: colors.error },
  inherit: { color: "inherit" },
  modalText: { color: colors.modalText },
  modalTextDim: { color: colors.modalTextDim },
  modalTextSecondary: { color: colors.modalTextSecondary },
});

const sizeStyles = stylex.create({
  "12": { fontSize: 12, lineHeight: "16px" },
  "13": { fontSize: 13, lineHeight: "18px" },
  "14": { fontSize: 14, lineHeight: "20px" },
  "15": { fontSize: 15, lineHeight: "22px" },
  "16": { fontSize: 16, lineHeight: "22px" },
  "17": { fontSize: 17, letterSpacing: "-0.01em", lineHeight: "24px" },
  "18": { fontSize: 18, letterSpacing: "-0.01em", lineHeight: "24px" },
  "20": { fontSize: 20, letterSpacing: "-0.015em", lineHeight: "26px" },
});

const weightStyles = stylex.create({
  regular: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  semibold: { fontWeight: 600 },
});

const alignStyles = stylex.create({
  center: { textAlign: "center" },
  inherit: { textAlign: "inherit" },
  left: { textAlign: "left" },
});

export type TextProps = {
  as?: "div" | "h1" | "h2" | "p" | "span";
  align?: keyof typeof alignStyles;
  children?: React.ReactNode;
  color: keyof typeof colorStyles;
  id?: string;
  size: keyof typeof sizeStyles;
  testId?: string;
  weight: keyof typeof weightStyles;
  xstyle?: stylex.StyleXStyles;
};

export function Text({
  align = "inherit",
  as: Tag = "div",
  children,
  color,
  id,
  size,
  testId,
  weight,
  xstyle,
}: TextProps) {
  return (
    <Tag
      {...stylex.props(
        reset.text,
        colorStyles[color],
        sizeStyles[size],
        weightStyles[weight],
        alignStyles[align],
        xstyle,
      )}
      data-testid={testId ? `rk-${testId}` : undefined}
      id={id}
    >
      {children}
    </Tag>
  );
}
