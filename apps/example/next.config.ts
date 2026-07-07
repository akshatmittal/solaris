import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/solaris" : "",
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: ["solariskit"],
};

export default nextConfig;
