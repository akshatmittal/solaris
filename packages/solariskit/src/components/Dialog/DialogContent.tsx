import React, { type ReactNode, useEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, media, motion, radii, shadows } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";

const bleed = 200;

const styles = stylex.create({
  content: {
    backgroundColor: colors.modalBackground,
    borderColor: colors.modalBorder,
    borderRadius: { default: radii.modalMobile, [media.largeScreen]: radii.modal },
    borderStyle: "solid",
    borderWidth: { default: 0, [media.largeScreen]: 1 },
    boxShadow: shadows.dialog,
    boxSizing: "border-box",
    color: colors.modalText,
    display: "flex",
    flexDirection: "column",
    maxWidth: "100vw",
    overflow: "hidden",
    position: "relative",
    width: { default: "100vw", [media.largeScreen]: 360 },
    // Small screens: a bottom sheet that bleeds below the viewport and keeps its content above the home indicator.
    borderBottomLeftRadius: { default: 0, [media.largeScreen]: radii.modal },
    borderBottomRightRadius: { default: 0, [media.largeScreen]: radii.modal },
    marginTop: { default: -bleed, [media.largeScreen]: 0 },
    paddingBottom: { default: `calc(${bleed}px + env(safe-area-inset-bottom, 0px))`, [media.largeScreen]: 0 },
    top: { default: bleed, [media.largeScreen]: 0 },
  },
  // The mobile wallet grid needs more room when a tablet shows it in a dialog.
  wideMobile: { width: { default: "100vw", [media.largeScreen]: 480 } },
  // Animates between the measured heights of the content; the first height applies without a transition.
  sizer: {
    overflow: "hidden",
    transitionDuration: { default: motion.enter, [media.reducedMotion]: "0s" },
    transitionProperty: "height",
    transitionTimingFunction: motion.easeOut,
  },
  // Content taller than the screen scrolls. The dialog bound matches the top offset in Dialog plus a 16px bottom gap and the border.
  measure: {
    display: "flex",
    flexDirection: "column",
    maxHeight: {
      default: "calc(100dvh - 40px - env(safe-area-inset-bottom, 0px))",
      [media.largeScreen]: "calc(100dvh - max(16px, calc(50vh - 280px)) - 18px)",
    },
    overflowX: "hidden",
    overflowY: "auto",
  },
});

export function DialogContent({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const measure = measureRef.current;
    if (!measure) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setHeight(entry.borderBoxSize[0]?.blockSize);
      }
    });
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);

  return (
    <div {...stylex.props(styles.content, wide && isMobile() && styles.wideMobile)}>
      <div
        {...stylex.props(styles.sizer)}
        style={{ height }}
      >
        <div
          ref={measureRef}
          {...stylex.props(styles.measure)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
