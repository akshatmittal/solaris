import { type ResponsiveValue, normalizeResponsiveValue } from "../../css/responsive";
/**
 * Whether the EVM and Solana connect buttons fetch the balance. A responsive value fetches it when any screen size
 * shows it; the button's CSS shows or hides it by screen width.
 */
export function resolveShowBalance(showBalance: ResponsiveValue<boolean> | undefined): boolean {
  if (typeof showBalance === "boolean") {
    return showBalance;
  }

  if (showBalance) {
    const { largeScreen, smallScreen } = normalizeResponsiveValue(showBalance);
    return smallScreen || largeScreen;
  }

  return true;
}
