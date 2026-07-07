import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const solanaWeb3OptionalShim = "./src/solana-web3-optional-shim.ts";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/solaris" : "",
  reactStrictMode: true,
  trailingSlash: true,
  turbopack: {
    resolveAlias: {
      "@solana/web3.js": solanaWeb3OptionalShim,
    },
  },
  transpilePackages: ["solariskit"],
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["@solana/web3.js"] = solanaWeb3OptionalShim;
    return config;
  },
};

export default nextConfig;
