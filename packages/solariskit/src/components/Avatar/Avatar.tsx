import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { AvatarContext } from "../SolarisEthereumProvider/AvatarContext";

const styles = stylex.create({
  container: {
    flexShrink: 0,
    position: "relative",
    userSelect: "none",
  },
  avatar: {
    alignItems: "center",
    borderRadius: 9999,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  // Pending-transaction badge, ringed in the trigger surface color.
  pending: {
    backgroundColor: colors.accentColor,
    borderRadius: 9999,
    boxShadow: `0 0 0 2px ${colors.connectButtonBackground}`,
    height: 8,
    position: "absolute",
    right: -3,
    top: -3,
    width: 8,
  },
});

export interface AvatarProps {
  address: string;
  loading?: boolean;
  imageUrl?: string | null;
  size: number;
}

export function Avatar({ address, imageUrl, loading, size }: AvatarProps) {
  const AvatarComponent = useContext(AvatarContext);

  return (
    <div
      {...stylex.props(styles.container)}
      aria-hidden
      style={{ height: size, width: size }}
    >
      <div
        {...stylex.props(styles.avatar)}
        style={{ fontSize: Math.round(size * 0.55) }}
      >
        <AvatarComponent
          address={address}
          ensImage={imageUrl}
          size={size}
        />
      </div>
      {loading && <div {...stylex.props(styles.pending)} />}
    </div>
  );
}
