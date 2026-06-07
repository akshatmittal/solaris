import { useChainId as useWagmiChainId } from "wagmi";

export function useSelectedChainId(connectedChainId: number | null | undefined): number {
  const wagmiChainId = useWagmiChainId();

  return connectedChainId ?? wagmiChainId;
}
