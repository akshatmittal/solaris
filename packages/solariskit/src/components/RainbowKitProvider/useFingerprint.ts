import { useCallback, useEffect } from "react";

import { setStorageItem } from "../../wallets/walletIdStorage";

const storageKey = "rk-version";

function setRainbowKitVersion({ version }: { version: string }) {
  setStorageItem(storageKey, version);
}

export function useFingerprint() {
  const fingerprint = useCallback(() => {
    setRainbowKitVersion({ version: "__buildVersion" });
  }, []);
  useEffect(() => {
    fingerprint();
  }, [fingerprint]);
}
