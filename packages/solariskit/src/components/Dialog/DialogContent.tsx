import React, { type ReactNode, useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, media, radii, shadows } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";
import { ModalSizeContext, ModalSizeOptions } from "../RainbowKitProvider/ModalSizeContext";

const bleed = 200;

const styles = stylex.create({
  content: {
    backgroundColor: colors.modalBackground,
    borderColor: colors.modalBorder,
    borderRadius: radii.modal,
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow: shadows.dialog,
    boxSizing: "border-box",
    color: colors.modalText,
    display: "flex",
    flexDirection: "column",
    maxWidth: "100vw",
    overflow: "hidden",
    position: "relative",
    width: 360,
  },
  wideDesktop: { minWidth: 720, width: 720 },
  wideCompact: { minWidth: 360, width: 360 },
  wideMobile: { width: { default: "100vw", [media.largeScreen]: 480 } },
  mobile: {
    borderRadius: radii.modalMobile,
    borderWidth: 0,
    width: "100vw",
  },
  bottomSheet: {
    borderBottomLeftRadius: { default: 0, [media.largeScreen]: null },
    borderBottomRightRadius: { default: 0, [media.largeScreen]: null },
    marginTop: { default: -bleed, [media.largeScreen]: null },
    paddingBottom: { default: bleed, [media.largeScreen]: null },
    top: { default: bleed, [media.largeScreen]: null },
  },
});

export function DialogContent({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const mobile = isMobile();
  const compactModeEnabled = useContext(ModalSizeContext) === ModalSizeOptions.COMPACT;

  return (
    <div
      {...stylex.props(
        styles.content,
        mobile && styles.mobile,
        mobile && styles.bottomSheet,
        wide && (mobile ? styles.wideMobile : compactModeEnabled ? styles.wideCompact : styles.wideDesktop),
      )}
    >
      {children}
    </div>
  );
}
