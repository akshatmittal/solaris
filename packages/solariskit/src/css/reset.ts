import * as stylex from "@stylexjs/stylex";

import { colors } from "./vars.stylex";

// Neutralizes host-page element styles on the native elements we render.
export const reset = stylex.create({
  button: {
    appearance: "none",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderStyle: "none",
    boxSizing: "border-box",
    color: "inherit",
    cursor: { default: "pointer", ":disabled": "default" },
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    margin: 0,
    padding: 0,
    textAlign: "inherit",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    outlineColor: colors.accentColor,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
  },
  text: {
    margin: 0,
    padding: 0,
  },
});
