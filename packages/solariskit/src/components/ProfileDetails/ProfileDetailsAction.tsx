import React, { type JSX, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media, motion, radii } from "../../css/vars.stylex";

const iconIn = stylex.keyframes({
  from: { opacity: 0, transform: "scale(0.95)" },
  to: { opacity: 1, transform: "none" },
});

const iconFadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const styles = stylex.create({
  action: {
    alignItems: "center",
    backgroundColor: {
      default: colors.profileAction,
      ":hover": { default: null, [media.hover]: colors.profileActionHover },
    },
    borderRadius: radii.actionButton,
    color: colors.modalText,
    display: "flex",
    flexBasis: 0,
    flexGrow: 1,
    fontSize: 14,
    fontWeight: 500,
    gap: 8,
    height: 44,
    justifyContent: "center",
  },
  icon: {
    color: colors.modalTextSecondary,
    display: "flex",
  },
  iconChanged: {
    animationDuration: motion.enter,
    animationName: { default: iconIn, [media.reducedMotion]: iconFadeIn },
    animationTimingFunction: motion.easeOut,
  },
  success: {
    color: colors.success,
  },
  successAction: {
    backgroundColor: `color-mix(in srgb, ${colors.success} 10%, transparent)`,
  },
});

interface ProfileDetailsActionProps {
  label: string;
  action?: () => void;
  icon: JSX.Element;
  success?: boolean;
}

export function ProfileDetailsAction({ action, icon, label, success = false }: ProfileDetailsActionProps) {
  // Animate only on change, not when the modal opens.
  const [shownSuccess, setShownSuccess] = useState(success);
  const [iconChanged, setIconChanged] = useState(false);
  if (success !== shownSuccess) {
    setShownSuccess(success);
    setIconChanged(true);
  }

  return (
    <button
      {...stylex.props(reset.button, styles.action, success && styles.successAction, press.scale)}
      onClick={action}
      type="button"
    >
      <span
        {...stylex.props(styles.icon, iconChanged && styles.iconChanged, success && styles.success)}
        key={String(success)}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
