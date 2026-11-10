import React, { type MouseEventHandler, type ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import * as stylex from "@stylexjs/stylex";

import { blurs, colors, fonts } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";
import { useThemeRootProps } from "../RainbowKitProvider/ThemeRootContext";
import { FocusTrap } from "./FocusTrap";

const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const riseIn = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
  to: { opacity: 1, transform: "none" },
});

const slideUp = stylex.keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "none" },
});

const reducedMotion = "@media (prefers-reduced-motion: reduce)";

const bleed = 200;

const styles = stylex.create({
  overlay: {
    alignItems: "center",
    animationDuration: "150ms",
    animationName: { default: fadeIn, [reducedMotion]: "none" },
    animationTimingFunction: "ease-out",
    backdropFilter: blurs.modalOverlay,
    backgroundColor: colors.modalBackdrop,
    bottom: -bleed,
    display: "flex",
    fontFamily: fonts.body,
    justifyContent: "center",
    left: -bleed,
    lineHeight: "normal",
    padding: bleed,
    position: "fixed",
    right: -bleed,
    textAlign: "left",
    top: -bleed,
    // Required for content to render under the URL bar on iOS.
    transform: "translateZ(0)",
    WebkitFontSmoothing: "antialiased",
    // Just below nested wallet SDK modals (Coinbase uses 2147483647).
    zIndex: 2147483646,
  },
  overlayMobile: {
    alignItems: "flex-end",
  },
  content: {
    animationDuration: "200ms",
    animationName: { default: riseIn, [reducedMotion]: "none" },
    animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100vw",
    position: "relative",
  },
  contentMobile: {
    animationDuration: "300ms",
    animationName: { default: slideUp, [reducedMotion]: "none" },
  },
});

const stopPropagation: MouseEventHandler<unknown> = (event) => event.stopPropagation();

interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
}

// Stack of currently open dialogs across every provider instance on the
// page, so Escape only closes the most recently opened one instead of every
// open dialog at once (e.g. an EVM and a Solana modal open simultaneously).
const openDialogStack: symbol[] = [];

export function Dialog({ children, onClose, open, titleId }: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const token = Symbol("rk-dialog");
    openDialogStack.push(token);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDialogStack[openDialogStack.length - 1] === token) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      openDialogStack.splice(openDialogStack.indexOf(token), 1);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const [bodyScrollable, setBodyScrollable] = useState(true);
  useEffect(() => {
    setBodyScrollable(getComputedStyle(window.document.body).overflow !== "hidden");
  }, []);

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);
  const themeRootProps = useThemeRootProps();
  const mobile = isMobile();

  return (
    <>
      {open
        ? createPortal(
            <RemoveScroll enabled={bodyScrollable}>
              <div {...themeRootProps}>
                <div
                  {...themeRootProps}
                  {...stylex.props(styles.overlay, mobile && styles.overlayMobile)}
                  aria-labelledby={titleId}
                  aria-modal
                  onClick={handleBackdropClick}
                  role="dialog"
                >
                  <FocusTrap
                    {...stylex.props(styles.content, mobile && styles.contentMobile)}
                    onClick={stopPropagation}
                    role="document"
                  >
                    {children}
                  </FocusTrap>
                </div>
              </div>
            </RemoveScroll>,
            document.body,
          )
        : null}
    </>
  );
}
