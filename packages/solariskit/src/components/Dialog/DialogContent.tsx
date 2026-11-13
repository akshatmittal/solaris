import React, { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { reset } from "../../css/reset";
import { colors, media, motion, radii, shadows } from "../../css/vars.stylex";

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
    borderBottomLeftRadius: { default: 0, [media.largeScreen]: radii.modal },
    borderBottomRightRadius: { default: 0, [media.largeScreen]: radii.modal },
    marginTop: { default: -bleed, [media.largeScreen]: 0 },
    paddingBottom: { default: `calc(${bleed}px + env(safe-area-inset-bottom, 0px))`, [media.largeScreen]: 0 },
    top: { default: bleed, [media.largeScreen]: 0 },
  },
  // Animates between the measured heights of the content; the first height applies without a transition.
  sizer: {
    overflow: "hidden",
    transitionDuration: { default: motion.enter, [media.reducedMotion]: "0s" },
    transitionProperty: "height",
    transitionTimingFunction: motion.easeOut,
  },
  // The dialog bound is the top offset in Dialog, a 16px bottom gap, and the border.
  measure: {
    display: "flex",
    flexDirection: "column",
    maxHeight: {
      default: "calc(100dvh - max(40px, env(safe-area-inset-top, 0px) + 8px) - env(safe-area-inset-bottom, 0px))",
      [media.largeScreen]: "calc(100dvh - max(16px, calc(50vh - 280px)) - 18px)",
    },
    overflowX: "hidden",
    overflowY: "auto",
  },
});

export function DialogContent({ children, view }: { children: ReactNode; view?: string }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    measureRef.current?.scrollTo(0, 0);
  }, [view]);

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
    <div {...stylex.props(styles.content)}>
      <div
        {...stylex.props(styles.sizer)}
        style={{ height }}
      >
        <div
          ref={measureRef}
          {...stylex.props(styles.measure, reset.scrollbar)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
