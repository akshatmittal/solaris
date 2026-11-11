import React, { type ReactNode, useEffect, useRef, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors, media, motion, radii, shadows } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";

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
  wideMobile: { width: { default: "100vw", [media.largeScreen]: 480 } },
  mobile: {
    borderRadius: radii.modalMobile,
    borderWidth: 0,
    width: "100vw",
  },
  // Animates between the measured heights of the content; the first height applies without a transition.
  sizer: {
    overflow: "hidden",
    transitionDuration: { default: motion.enter, "@media (prefers-reduced-motion: reduce)": "0s" },
    transitionProperty: "height",
    transitionTimingFunction: "ease-out",
  },
  measure: {
    display: "flex",
    flexDirection: "column",
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
    <div
      {...stylex.props(
        styles.content,
        mobile && styles.mobile,
        mobile && styles.bottomSheet,
        wide && mobile && styles.wideMobile,
      )}
    >
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
