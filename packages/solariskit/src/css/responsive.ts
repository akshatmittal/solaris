import * as stylex from "@stylexjs/stylex";

import { media } from "./vars.stylex";

export type ResponsiveValue<Value extends string | number | boolean> =
  | Value
  | { smallScreen: Value; largeScreen?: Value };

export function normalizeResponsiveValue<Value extends string | number | boolean>(
  value: ResponsiveValue<Value>,
): { smallScreen: Value; largeScreen: Value } {
  return typeof value === "object"
    ? { smallScreen: value.smallScreen, largeScreen: value.largeScreen ?? value.smallScreen }
    : { smallScreen: value, largeScreen: value };
}

const styles = stylex.create({
  hidden: { display: "none" },
  block: { display: "block" },
  blockLargeOnly: { display: { default: "none", [media.largeScreen]: "block" } },
  blockSmallOnly: { display: { default: "block", [media.largeScreen]: "none" } },
  flex: { display: "flex" },
  flexLargeOnly: { display: { default: "none", [media.largeScreen]: "flex" } },
  flexSmallOnly: { display: { default: "flex", [media.largeScreen]: "none" } },
});

export function responsiveDisplay<Value extends string | number | boolean>(
  value: ResponsiveValue<Value>,
  isVisible: (value: Value) => boolean,
  display: "block" | "flex",
) {
  const { largeScreen, smallScreen } = normalizeResponsiveValue(value);
  const small = isVisible(smallScreen);
  const large = isVisible(largeScreen);

  if (small && large) return display === "block" ? styles.block : styles.flex;
  if (large) return display === "block" ? styles.blockLargeOnly : styles.flexLargeOnly;
  if (small) return display === "block" ? styles.blockSmallOnly : styles.flexSmallOnly;
  return styles.hidden;
}
