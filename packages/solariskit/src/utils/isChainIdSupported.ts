export function isChainIdSupported(
  chains: readonly { id: number }[],
  chainId: number | null | undefined,
): chainId is number {
  return chainId != null && chains.some((chain) => chain.id === chainId);
}
