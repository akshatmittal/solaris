import * as stylex from "@stylexjs/stylex";

import { colors, media } from "./vars.stylex";

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
    touchAction: "manipulation",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    WebkitUserSelect: "none",
    outlineColor: colors.accentColor,
    outlineOffset: 2,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
  },
  text: {
    margin: 0,
    padding: 0,
  },
  scrollbar: {
    scrollbarColor: {
      default: null,
      "@supports not selector(::-webkit-scrollbar)": `${colors.modalTextDim} transparent`,
    },
    scrollbarWidth: {
      default: null,
      "@supports not selector(::-webkit-scrollbar)": "thin",
      [media.coarsePointer]: "none",
    },
    "::-webkit-scrollbar": {
      display: { default: null, [media.coarsePointer]: "none" },
      width: 10,
    },
    "::-webkit-scrollbar-thumb": {
      backgroundClip: "padding-box",
      backgroundColor: colors.modalTextDim,
      borderColor: "transparent",
      borderRadius: 999,
      borderStyle: "solid",
      borderWidth: 3,
    },
  },
});
