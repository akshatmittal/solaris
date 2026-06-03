import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2024",
  dts: true,
  entry: {
    index: "./src/index.ts",
  },
  format: "esm",
  minify: false,
  outDir: "dist",
  platform: "browser",
});
