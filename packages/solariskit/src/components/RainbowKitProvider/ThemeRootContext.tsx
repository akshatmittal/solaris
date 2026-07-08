import React, { createContext, type ReactNode, useContext, useId, useMemo } from "react";

import type { Theme } from "./RainbowKitProvider";

import { cssStringFromTheme } from "../../css/cssStringFromTheme";

const ThemeIdContext = createContext<string | undefined>(undefined);

const attr = "data-rk";

export const createThemeRootProps = (id: string | undefined) => ({ [attr]: id || "" });

export const createThemeRootSelector = (id: string | undefined) => {
  if (id && !/^[a-zA-Z0-9_]+$/.test(id)) {
    throw new Error(`Invalid ID: ${id}`);
  }

  return id ? `[${attr}="${id}"]` : `[${attr}]`;
};

export function ThemeIdProvider({ children, id }: { children: ReactNode; id?: string }) {
  return <ThemeIdContext.Provider value={id}>{children}</ThemeIdContext.Provider>;
}

export const useThemeRootProps = () => {
  const id = useContext(ThemeIdContext);
  return createThemeRootProps(id);
};

/**
 * Shared provider-shell theming used by both RainbowKitProvider and
 * SolanaKitProvider. When no id is given, a hydration-stable unique id is
 * generated so two providers on one page (e.g. an EVM and a Solana island)
 * scope their CSS variables to their own subtree instead of both emitting
 * the bare [data-rk] selector and stomping each other's theme.
 */
export function useThemeRoot(id: string | undefined, theme: Theme | null | undefined) {
  const autoId = `rk${useId().replace(/\W/g, "")}`;
  const themeId = id ?? autoId;

  const themeCss = useMemo(() => {
    if (!theme || typeof theme === "function") {
      return null;
    }

    const selector = createThemeRootSelector(themeId);

    return [
      `${selector}{${cssStringFromTheme("lightMode" in theme ? theme.lightMode : theme)}}`,
      "darkMode" in theme
        ? `@media(prefers-color-scheme:dark){${selector}{${cssStringFromTheme(theme.darkMode, {
            extends: theme.lightMode,
          })}}}`
        : null,
    ].join("");
  }, [theme, themeId]);

  if (typeof theme === "function") {
    throw new Error(
      'A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.',
    );
  }

  return { themeCss, themeId };
}

export function ThemeRootStyle({
  children,
  themeCss,
  themeId,
}: {
  children: ReactNode;
  themeCss: string | null;
  themeId: string;
}) {
  if (!themeCss) {
    return <>{children}</>;
  }

  return (
    <div {...createThemeRootProps(themeId)}>
      <style>{themeCss}</style>
      {children}
    </div>
  );
}
