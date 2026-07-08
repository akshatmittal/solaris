import { type ResponsiveValue, normalizeResponsiveValue } from "../../css/sprinkles.css";
import { isMobile } from "../../utils/isMobile";

/**
 * Resolves the responsive `showBalance` prop for the current screen size.
 * Single source of truth for the EVM and Solana connect buttons.
 */
export function resolveShowBalance(showBalance: ResponsiveValue<boolean> | undefined): boolean {
  if (typeof showBalance === "boolean") {
    return showBalance;
  }

  if (showBalance) {
    return normalizeResponsiveValue(showBalance)[isMobile() ? "smallScreen" : "largeScreen"] ?? false;
  }

  return true;
}
