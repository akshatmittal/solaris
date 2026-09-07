import { useEffect } from "react";

import { setStorageItem } from "../../wallets/walletIdStorage";

const storageKey = "rk-version";

export function useFingerprint() {
  useEffect(() => {
    setStorageItem(storageKey, "__buildVersion");
  }, []);
}
