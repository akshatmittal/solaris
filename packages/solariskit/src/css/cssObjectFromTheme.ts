import type { ThemeVars } from "./themeVars";

const resolveThemeVars = (theme: ThemeVars | (() => ThemeVars)) => (typeof theme === "function" ? theme() : theme);

const toCssVars = (theme: ThemeVars): Record<string, string> =>
  Object.fromEntries(
    Object.entries(theme).flatMap(([group, values]) =>
      Object.entries<string>(values).map(([key, value]) => [`--solaris-${group}-${key}`, value]),
    ),
  );

export function cssObjectFromTheme(
  theme: ThemeVars | (() => ThemeVars),
  { extends: baseTheme }: { extends?: ThemeVars | (() => ThemeVars) } = {},
) {
  const resolvedThemeVars = toCssVars(resolveThemeVars(theme));

  if (!baseTheme) {
    return resolvedThemeVars;
  }

  const resolvedBaseThemeVars = toCssVars(resolveThemeVars(baseTheme));

  return Object.fromEntries(
    Object.entries(resolvedThemeVars).filter(([varName, value]) => value !== resolvedBaseThemeVars[varName]),
  );
}
