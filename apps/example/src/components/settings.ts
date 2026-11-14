import { parseAsBoolean, parseAsStringLiteral } from "nuqs";

export const themeNames = ["light", "dark"] as const;

export const kitSettings = {
  theme: parseAsStringLiteral(themeNames).withDefault("light"),
  siwe: parseAsBoolean.withDefault(true),
};
