import React, { useEffect, useMemo, useState } from "react";

import { polyconDataUri } from "@akshatmittal/polycons";
import * as stylex from "@stylexjs/stylex";

import type { AvatarComponent } from "../RainbowKitProvider/AvatarContext";

import { colors } from "../../css/vars.stylex";
import { SpinnerIcon } from "../Icons/Spinner";

const styles = stylex.create({
  image: {
    backgroundPosition: "center",
    backgroundSize: "cover",
    inset: 0,
    position: "absolute",
  },
  loading: {
    alignItems: "center",
    color: colors.modalText,
    display: "flex",
    inset: 0,
    justifyContent: "center",
    position: "absolute",
  },
});

export const EmojiAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ensImage) {
      const img = new Image();
      img.src = ensImage;
      img.onload = () => setLoaded(true);
    }
  }, [ensImage]);

  const polyconImage = useMemo(() => polyconDataUri(address, size), [address, size]);

  if (ensImage && !loaded) {
    return (
      <div {...stylex.props(styles.loading)}>
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <div
      {...stylex.props(styles.image)}
      style={{ backgroundImage: `url(${ensImage ?? polyconImage})` }}
    />
  );
};
