import React, { useReducer } from "react";

import * as stylex from "@stylexjs/stylex";

import { motion } from "../../css/vars.stylex";
import { type AsyncImageSrc, useAsyncImage } from "./useAsyncImage";

const styles = stylex.create({
  container: {
    flexShrink: 0,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    display: "block",
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    transitionDuration: motion.fast,
    transitionProperty: "opacity",
    transitionTimingFunction: motion.easeOut,
    userSelect: "none",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    width: "100%",
  },
  hidden: { opacity: 0 },
});

interface AsyncImageProps {
  alt?: string;
  background?: string;
  radius?: number | "full";
  size: number;
  src: string | AsyncImageSrc | undefined;
  testId?: string;
  useAsImage?: boolean;
}

export function AsyncImage({ alt, background, radius = 0, size, src: srcProp, testId, useAsImage }: AsyncImageProps) {
  const src = useAsyncImage(srcProp);
  const isRemoteImage = src?.startsWith("http") ?? false;
  const [isRemoteImageLoaded, setRemoteImageLoaded] = useReducer(() => true, false);

  return (
    <div
      {...stylex.props(styles.container)}
      aria-label={alt}
      data-testid={testId ? `rk-${testId}` : undefined}
      role="img"
      style={{
        background,
        borderRadius: radius === "full" ? 9999 : radius,
        height: size,
        width: size,
      }}
    >
      {src ? (
        <img
          {...stylex.props(styles.image, !useAsImage && isRemoteImage && !isRemoteImageLoaded && styles.hidden)}
          alt=""
          aria-hidden
          onLoad={isRemoteImage ? setRemoteImageLoaded : undefined}
          src={src}
        />
      ) : null}
    </div>
  );
}
