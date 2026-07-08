import React, { type MouseEventHandler, type ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { isMobile } from "../../utils/isMobile";
import { Box } from "../Box/Box";
import { useThemeRootProps } from "../RainbowKitProvider/ThemeRootContext";
import * as styles from "./Dialog.css";
import { FocusTrap } from "./FocusTrap";

const stopPropagation: MouseEventHandler<unknown> = (event) => event.stopPropagation();

interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  onMountAutoFocus?: (event: Event) => void;
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
              <Box {...themeRootProps}>
                <Box
                  {...themeRootProps}
                  alignItems={mobile ? "flex-end" : "center"}
                  aria-labelledby={titleId}
                  aria-modal
                  className={styles.overlay}
                  onClick={handleBackdropClick}
                  position="fixed"
                  role="dialog"
                >
                  <FocusTrap
                    className={styles.content}
                    onClick={stopPropagation}
                    role="document"
                  >
                    {children}
                  </FocusTrap>
                </Box>
              </Box>
            </RemoveScroll>,
            document.body,
          )
        : null}
    </>
  );
}
