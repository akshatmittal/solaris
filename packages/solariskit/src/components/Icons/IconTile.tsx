import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";

const styles = stylex.create({
  tile: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: 9999,
    color: colors.accentColor,
    display: "flex",
    flexShrink: 0,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
});

export const IconTile = ({ children }: { children: ReactNode }) => <div {...stylex.props(styles.tile)}>{children}</div>;
