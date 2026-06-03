import { useEffect, useMemo, useState } from "react";

import { polyconDataUri } from "@akshatmittal/polycons";

import type { AvatarComponent } from "../RainbowKitProvider/AvatarContext";

import { Box } from "../Box/Box";
import { SpinnerIcon } from "../Icons/Spinner";

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

  return ensImage ? (
    loaded ? (
      <Box
        backgroundSize="cover"
        position="absolute"
        style={{
          backgroundImage: `url(${ensImage})`,
          backgroundPosition: "center",
          height: size,
          width: size,
        }}
      />
    ) : (
      <Box
        alignItems="center"
        backgroundSize="cover"
        color="modalText"
        display="flex"
        justifyContent="center"
        position="absolute"
        style={{
          height: size,
          width: size,
        }}
      >
        <SpinnerIcon />
      </Box>
    )
  ) : (
    <Box
      backgroundSize="cover"
      overflow="hidden"
      position="absolute"
      style={{
        backgroundImage: `url(${polyconImage})`,
        backgroundPosition: "center",
        height: size,
        width: size,
      }}
    />
  );
};
