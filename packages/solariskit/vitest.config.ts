import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    {
      name: "custom-json-loader",
      transform(code, id) {
        if (id.endsWith(".json")) {
          return `export default ${JSON.stringify(readFileSync(id, "utf8"))};`;
        }

        return code;
      },
    },
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    watch: false,
    exclude: ["**/node_modules/**", "**/dist/**", "**/.conductor/**", "**/examples/with-next-mint-nft/contract/**"],
  },
});
