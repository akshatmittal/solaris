import React, { type JSX } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media, radii } from "../../css/vars.stylex";

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
    justifyContent: "center",
    minHeight: 44,
    paddingBlock: 8,
    paddingInline: 12,
    textAlign: "center",
  },
  icon: {
    color: colors.modalTextSecondary,
    display: "flex",
  },
});

type ProfileDetailsActionProps = { icon: JSX.Element; label: string } & (
  | { action: () => void; href?: never }
  | { action?: never; href: string }
);

export function ProfileDetailsAction({ action, href, icon, label }: ProfileDetailsActionProps) {
  const props = stylex.props(reset.button, styles.action, press.scale);
  const content = (
    <>
      <span
        {...stylex.props(styles.icon)}
        aria-hidden
      >
        {icon}
      </span>
      {label}
    </>
  );

  return href ? (
    <a
      {...props}
      href={href}
      rel="noreferrer noopener"
      target="_blank"
    >
      {content}
    </a>
  ) : (
    <button
      {...props}
      onClick={action}
      type="button"
    >
      {content}
    </button>
  );
}
