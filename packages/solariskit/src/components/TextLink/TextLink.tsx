import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media } from "../../css/vars.stylex";

const styles = stylex.create({
  link: {
    alignItems: "center",
    color: colors.accentColor,
    display: "inline-flex",
    fontSize: 14,
    fontWeight: 500,
    gap: 4,
    lineHeight: "20px",
    opacity: { default: 1, ":hover": { default: null, [media.hover]: 0.75 } },
    textDecoration: "none",
  },
  // Keeps a 44px touch target without changing the visual size.
  tall: {
    minHeight: 44,
  },
});

export function TextLink({
  children,
  href,
  onClick,
  tall = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  tall?: boolean;
}) {
  const props = stylex.props(reset.button, styles.link, tall && styles.tall, press.scale);

  return href ? (
    <a
      {...props}
      href={href}
      rel="noreferrer noopener"
      target="_blank"
    >
      {children}
    </a>
  ) : (
    <button
      {...props}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
