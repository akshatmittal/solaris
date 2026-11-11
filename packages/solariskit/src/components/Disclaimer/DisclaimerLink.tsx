import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";

const styles = stylex.create({
  link: {
    color: colors.accentColor,
    textDecoration: "none",
  },
});

export const DisclaimerLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <a
    {...stylex.props(styles.link)}
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
);
