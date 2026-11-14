import React, { useState } from "react";

import * as stylex from "@stylexjs/stylex";

import type { CopyResult } from "../../hooks/useCopyToClipboard";

import { colors, media, motion } from "../../css/vars.stylex";
import { t } from "../../translations";
import { CancelIcon } from "../Icons/Cancel";
import { CopiedIcon } from "../Icons/Copied";
import { CopyIcon } from "../Icons/Copy";

const iconIn = stylex.keyframes({
  from: { opacity: 0, transform: "scale(0.95)" },
  to: { opacity: 1, transform: "none" },
});

const iconFadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const styles = stylex.create({
  icon: {
    color: colors.modalTextSecondary,
    display: "flex",
    justifyContent: "center",
    width: 17,
  },
  changed: {
    animationDuration: motion.enter,
    animationName: { default: iconIn, [media.reducedMotion]: iconFadeIn },
    animationTimingFunction: motion.easeOut,
  },
  copied: {
    color: colors.success,
  },
  failed: {
    color: colors.error,
  },
  message: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

export function CopyStatusIcon({ result }: { result: CopyResult | undefined }) {
  const [shownResult, setShownResult] = useState(result);
  const [changed, setChanged] = useState(false);
  if (result !== shownResult) {
    setShownResult(result);
    setChanged(true);
  }

  return (
    <span
      {...stylex.props(styles.icon, changed && styles.changed, result && styles[result])}
      aria-hidden
      key={result ?? "idle"}
    >
      {result === "copied" ? (
        <CopiedIcon />
      ) : result === "failed" ? (
        <CancelIcon
          height={16}
          width={16}
        />
      ) : (
        <CopyIcon />
      )}
    </span>
  );
}

export function CopyStatusMessage({ result }: { result: CopyResult | undefined }) {
  return (
    <span
      {...stylex.props(styles.message)}
      role="status"
    >
      {result === "copied" ? t("copy.copied") : result === "failed" ? t("copy.failed") : ""}
    </span>
  );
}
