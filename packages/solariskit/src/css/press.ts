import * as stylex from "@stylexjs/stylex";

import { media, motion } from "./vars.stylex";

// Press feedback for compact controls. It also sets the transition for their hover colors, so put it after the control's own styles.
export const press = stylex.create({
  scale: {
    transform: { default: null, ":active": { default: "scale(0.97)", [media.reducedMotion]: "none" } },
    transitionDuration: motion.press,
    transitionProperty: "background-color, color, opacity, transform",
    transitionTimingFunction: motion.easeOut,
  },
});
