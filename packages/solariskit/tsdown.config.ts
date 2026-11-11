import stylex from "@stylexjs/rollup-plugin";
import { defineConfig } from "tsdown";

import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  banner: {
    js: '"use client";',
  },
  define: {
    __SOLARISKIT_VERSION__: JSON.stringify(pkg.version),
  },
  entry: {
    index: "./src/index.ts",
    "components/index": "./src/components/index.ts",
    "solana/index": "./src/solana/index.ts",
    "wallets/walletConnectors/index": "./src/wallets/walletConnectors/index.ts",
  },
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  platform: "browser",
  plugins: [
    stylex({
      dev: false,
      fileName: "index.css",
      lightningcssOptions: {
        visitor: {
          // Scope every rule under the provider's `data-rk` root.
          Selector: (selector) => [
            { type: "attribute", name: "data-rk" },
            { type: "combinator", value: "descendant" },
            ...selector,
          ],
        },
      },
    }),
  ],
  target: "es2024",
});
