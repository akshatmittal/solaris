import React from "react";

import * as stylex from "@stylexjs/stylex";

import { motion } from "../../css/vars.stylex";

const spin = stylex.keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

const styles = stylex.create({
  icon: {
    animationDuration: motion.spin,
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
  },
});

export const SpinnerIcon = ({ height = 20, width = 20 }: { width?: string | number; height?: string | number }) => (
  <svg
    {...stylex.props(styles.icon)}
    fill="none"
    height={height}
    viewBox="0 0 20 20"
    width={width}
  >
    <title>Loading</title>
    <circle
      cx="10"
      cy="10"
      r="8"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path
      d="M10 2a8 8 0 0 1 8 8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
);
