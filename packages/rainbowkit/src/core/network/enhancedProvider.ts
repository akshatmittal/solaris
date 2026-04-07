import { createHttpClient } from "./internal/createHttpClient";

export const ENHANCED_PROVIDER_ENABLED = Boolean(
  typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.RAINBOW_PROVIDER_API_KEY,
);

export const enhancedProviderHttp = createHttpClient({
  baseUrl: "https://enhanced-provider.rainbow.me",
  headers: {
    "x-api-key":
      (typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.RAINBOW_PROVIDER_API_KEY) ||
      "LzbasoBiLqltex3VkcQ7LRmL4PtfiiZ1EMJrizrgfonWN6byJReu/l6yrUoo3zLW",
  },
});
