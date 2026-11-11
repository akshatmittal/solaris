import { parseAsStringLiteral } from "nuqs";

export const modalSizes = ["compact", "wide"] as const;
export const themeNames = ["light", "dark"] as const;

export const kitSettings = {
  modal: parseAsStringLiteral(modalSizes).withDefault("compact"),
  theme: parseAsStringLiteral(themeNames).withDefault("light"),
};
