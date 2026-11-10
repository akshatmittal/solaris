import React from "react";

import * as stylex from "@stylexjs/stylex";

import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { QRCodeSvg } from "./QRCodeSvg";

const padding = 16;

const styles = stylex.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    color: "black",
    padding,
    userSelect: "none",
    width: "max-content",
  },
  logo: {
    borderRadius: "22.5%",
    height: "88%",
    objectFit: "cover",
    width: "88%",
  },
});

export type ErrorCorrectionLevel = "low" | "medium" | "quartile" | "high";

interface Props {
  ecc?: ErrorCorrectionLevel;
  logoBackground?: string;
  logoUrl?: string | (() => Promise<string>);
  size?: number;
  uri: string;
}

export function QRCode({ ecc = "medium", logoBackground, logoUrl, size: sizeProp = 200, uri }: Props) {
  const size = sizeProp - padding * 2;
  const resolvedLogoUrl = useAsyncImage(logoUrl);

  return (
    <div {...stylex.props(styles.card)}>
      <div style={{ height: size, width: size }}>
        <QRCodeSvg
          ecc={ecc}
          logo={
            resolvedLogoUrl ? (
              <img
                {...stylex.props(styles.logo)}
                alt="Wallet Logo"
                src={resolvedLogoUrl}
                style={{ backgroundColor: logoBackground }}
              />
            ) : undefined
          }
          size={size}
          value={uri}
        />
      </div>
    </div>
  );
}
