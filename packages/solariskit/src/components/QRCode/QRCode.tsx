import React from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { useAsyncImage } from "../AsyncImage/useAsyncImage";
import { SpinnerIcon } from "../Icons/Spinner";
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
  loading: {
    alignItems: "center",
    color: colors.accentColor,
    display: "flex",
    justifyContent: "center",
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
  // Undefined while the wallet prepares the URI; the QR area shows a spinner at the same size.
  uri: string | undefined;
}

export function QRCode({ ecc = "medium", logoBackground, logoUrl, size: sizeProp = 200, uri }: Props) {
  const size = sizeProp - padding * 2;
  const resolvedLogoUrl = useAsyncImage(logoUrl);

  return (
    <div {...stylex.props(styles.card)}>
      <div
        {...stylex.props(uri === undefined && styles.loading)}
        style={{ height: size, width: size }}
      >
        {uri === undefined ? (
          <SpinnerIcon
            height={24}
            width={24}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
