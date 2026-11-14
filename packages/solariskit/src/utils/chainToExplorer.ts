import type { Chain } from "wagmi/chains";

export const chainToExplorer = (chain?: Chain) => {
  const explorer = chain?.blockExplorers?.default;
  return explorer && { name: explorer.name, url: explorer.url.replace(/\/+$/, "") };
};
