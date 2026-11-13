import React, { type MouseEventHandler, type ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import * as stylex from "@stylexjs/stylex";

import { blurs, colors, fonts, media, motion } from "../../css/vars.stylex";
import { useThemeRootProps } from "../SolarisEthereumProvider/ThemeRootContext";
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

const fadeOut = stylex.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const riseOut = stylex.keyframes({
  from: { opacity: 1, transform: "none" },
  to: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
});

const slideDown = stylex.keyframes({
  from: { transform: "none" },
  to: { transform: "translateY(100%)" },
});

// No `screen` type: lightningcss rewrites it into an invalid query here.
const largeScreenMotion = "@media (min-width: 768px) and (prefers-reduced-motion: no-preference)";

const bleed = 200;

const styles = stylex.create({
  overlay: {
    alignItems: { default: "flex-end", [media.largeScreen]: "flex-start" },
    animationDuration: { default: motion.sheetEnter, [media.largeScreen]: motion.enter },
    animationName: fadeIn,
    animationTimingFunction: motion.easeOut,
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
  overlayClosing: {
    animationDuration: { default: motion.sheetExit, [media.largeScreen]: motion.exit },
    animationFillMode: "forwards",
    animationName: fadeOut,
    pointerEvents: "none",
  },
  content: {
    animationDuration: { default: motion.sheetEnter, [media.largeScreen]: motion.enter },
    animationName: { default: slideUp, [media.reducedMotion]: fadeIn, [largeScreenMotion]: riseIn },
    animationTimingFunction: { default: motion.easeDrawer, [media.largeScreen]: motion.easeOut },
    display: "flex",
    flexDirection: "column",
    // A fixed top edge keeps the dialog still when its height changes. The offset centers a 560px dialog.
    marginTop: { default: null, [media.largeScreen]: "max(16px, calc(50vh - 280px))" },
    maxWidth: "100vw",
    position: "relative",
  },
  contentClosing: {
    animationDuration: { default: motion.sheetExit, [media.largeScreen]: motion.exit },
    animationFillMode: "forwards",
    animationName: { default: slideDown, [media.reducedMotion]: fadeOut, [largeScreenMotion]: riseOut },
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

    const token = Symbol("solaris-dialog");
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

  const [present, setPresent] = useState(open);
  if (open && !present) {
    setPresent(true);
  }
  const closing = present && !open;
  // Unmount after the longest exit animation (motion.sheetExit). A timer also works when the host page disables animations.
  useEffect(() => {
    if (!closing) {
      return;
    }
    const timeout = window.setTimeout(() => setPresent(false), 150);
    return () => window.clearTimeout(timeout);
  }, [closing]);
  // While closing, keep the last open content so it does not change during the exit animation.
  const [shownChildren, setShownChildren] = useState(children);
  if (open && shownChildren !== children) {
    setShownChildren(children);
  }

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);
  const themeRootProps = useThemeRootProps();

  return (
    <>
      {present
        ? createPortal(
            <RemoveScroll enabled={bodyScrollable}>
              <div {...themeRootProps}>
                <div
                  {...themeRootProps}
                  {...stylex.props(styles.overlay, closing && styles.overlayClosing)}
                  aria-labelledby={titleId}
                  aria-modal
                  onClick={handleBackdropClick}
                  role="dialog"
                >
                  <FocusTrap
                    {...stylex.props(styles.content, closing && styles.contentClosing)}
                    onClick={stopPropagation}
                    role="document"
                  >
                    {shownChildren}
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
