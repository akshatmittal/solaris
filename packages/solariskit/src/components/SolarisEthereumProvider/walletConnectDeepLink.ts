import { removeStorageItem, setStorageItem } from "../../wallets/walletIdStorage";

const storageKey = "WALLETCONNECT_DEEPLINK_CHOICE";

export function setWalletConnectDeepLink({ mobileUri, name }: { mobileUri: string; name: string }) {
  setStorageItem(
    storageKey,
    JSON.stringify({
      href: mobileUri.split("?")[0],
      name,
    }),
  );
}

export function clearWalletConnectDeepLink() {
  removeStorageItem(storageKey);
}
