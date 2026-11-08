import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/solaris" : "",
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: ["solariskit"],
  turbopack: {
    resolveAlias: {
      // @solana/connector lazy-imports @solana/web3.js only for legacy web3.js transaction objects; the Kit signer never takes that path.
      "@solana/web3.js": "./src/empty.ts",
    },
  },
};

export default nextConfig;
