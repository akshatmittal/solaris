import React, { useContext } from "react";

import { isMobile } from "../../utils/isMobile";
import { WalletButtonContext } from "../SolarisEthereumProvider/WalletButtonContext";
import { DesktopOptions } from "./DesktopOptions";
import { MobileOptions } from "./MobileOptions";
import { MobileStatus } from "./MobileStatus";

export default function ConnectOptions({
  onClose,
  onCloseModal,
  titleId,
}: {
  onClose: () => void;
  onCloseModal: () => void;
  titleId: string;
}) {
  const { connector } = useContext(WalletButtonContext);

  return isMobile() ? (
    connector ? (
      <MobileStatus
        onClose={onClose}
        onCloseModal={onCloseModal}
        titleId={titleId}
        wallet={connector}
      />
    ) : (
      <MobileOptions
        onClose={onClose}
        onCloseModal={onCloseModal}
        titleId={titleId}
      />
    )
  ) : (
    <DesktopOptions
      onClose={onClose}
      onCloseModal={onCloseModal}
      titleId={titleId}
    />
  );
}
