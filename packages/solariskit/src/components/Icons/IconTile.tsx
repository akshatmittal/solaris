import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";

const styles = stylex.create({
  tile: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    color: colors.accentColor,
    display: "flex",
    flexShrink: 0,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  large: {
    borderRadius: 9999,
    height: 64,
    width: 64,
  },
});

export const IconTile = ({ children, large = false }: { children: ReactNode; large?: boolean }) => (
  <div {...stylex.props(styles.tile, large && styles.large)}>{children}</div>
);
