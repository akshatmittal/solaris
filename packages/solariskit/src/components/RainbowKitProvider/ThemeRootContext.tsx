import React, { createContext, type ReactNode, useContext } from "react";

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
