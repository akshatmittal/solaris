import React, { useContext } from "react";

import { isMobile } from "../../utils/isMobile";
import { WalletButtonContext } from "../RainbowKitProvider/WalletButtonContext";
import { DesktopOptions } from "./DesktopOptions";
import { MobileOptions } from "./MobileOptions";
import { MobileStatus } from "./MobileStatus";

export default function ConnectOptions({ onClose, titleId }: { onClose: () => void; titleId: string }) {
  const { connector } = useContext(WalletButtonContext);

  return isMobile() ? (
    connector ? (
      <MobileStatus onClose={onClose} />
    ) : (
      <MobileOptions
        onClose={onClose}
        titleId={titleId}
      />
    )
  ) : (
    <DesktopOptions
      onClose={onClose}
      titleId={titleId}
    />
  );
}
