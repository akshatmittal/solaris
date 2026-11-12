// Truncates, so balances below 0.001 show as 0 and a balance never shows more than the account holds.
export function abbreviateETHBalance(number: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: number < 1 ? 3 : number < 100 ? 2 : 1,
    notation: number < 10_000 ? "standard" : "compact",
    roundingMode: "trunc",
  }).format(number);
}
