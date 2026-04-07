import autoprefixer from "autoprefixer";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";
import replace from "@rollup/plugin-replace";
import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

const isCssMinified = process.env.MINIFY_CSS === "true";

function postProcessExtractedCss() {
  return {
    name: "post-process-extracted-css",
    async generateBundle(
      _options: unknown,
      bundle: Record<
        string,
        { fileName?: string; type: string; source?: string | Uint8Array }
      >,
    ) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || typeof asset.source !== "string") {
          continue;
        }

        const result = await postcss([
          autoprefixer,
          prefixSelector({ prefix: "[data-rk]" }),
        ]).process(asset.source, {
          from: undefined,
        });

        asset.source = result.css;

        if (asset.fileName?.endsWith(".css")) {
          asset.fileName = "index.css";
        }
      }
    },
  };
}

export default defineConfig({
  banner: {
    js: '"use client";',
  },
  clean: true,
  dts: true,
  entry: {
    index: "./src/index.ts",
    "wallets/walletConnectors/index": "./src/wallets/walletConnectors/index.ts",
  },
  format: "esm",
  loader: {
    ".json": "text",
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  outDir: "dist",
  platform: "browser",
  plugins: [
    replace({
      include: ["src/components/RainbowKitProvider/useFingerprint.ts"],
      preventAssignment: true,
      values: {
        '"__buildVersion"': JSON.stringify(version),
      },
    }) as any,
    vanillaExtractPlugin({
      extract: {
        name: "index.css",
      },
      identifiers: isCssMinified ? "short" : "debug",
    }) as any,
    postProcessExtractedCss() as any,
  ],
  target: "es2022",
});
