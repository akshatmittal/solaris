import React, { type JSX } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, motion, radii } from "../../css/vars.stylex";

const styles = stylex.create({
  action: {
    alignItems: "center",
    backgroundColor: { default: colors.profileAction, ":hover": colors.profileActionHover },
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
    transitionDuration: motion.fast,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease-out",
  },
  icon: {
    color: colors.modalTextSecondary,
    display: "flex",
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
  testId?: string;
}

export function ProfileDetailsAction({ action, icon, label, success = false, testId }: ProfileDetailsActionProps) {
  return (
    <button
      {...stylex.props(reset.button, styles.action, success && styles.successAction)}
      data-testid={testId ? `rk-${testId}` : undefined}
      onClick={action}
      type="button"
    >
      <span {...stylex.props(styles.icon, success && styles.success)}>{icon}</span>
      {label}
    </button>
  );
}
