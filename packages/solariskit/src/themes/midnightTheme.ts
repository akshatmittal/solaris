import { type AccentColor, type AccentColorPreset, type ThemeOptions, baseTheme } from "./baseTheme";

const accentColors: Record<AccentColorPreset, AccentColor> = {
  blue: { accentColor: "#0A84FF", accentColorForeground: "#FFF" },
  green: { accentColor: "#4BD166", accentColorForeground: "#000" },
  orange: { accentColor: "#FF983D", accentColorForeground: "#000" },
  pink: { accentColor: "#FF7AB8", accentColorForeground: "#000" },
  purple: { accentColor: "#7A70FF", accentColorForeground: "#FFF" },
  red: { accentColor: "#FF6257", accentColorForeground: "#FFF" },
};

const defaultAccentColor = accentColors.blue;

export const midnightTheme = ({
  accentColor = defaultAccentColor.accentColor,
  accentColorForeground = defaultAccentColor.accentColorForeground,
  ...baseThemeOptions
}: ThemeOptions = {}) => ({
  ...baseTheme(baseThemeOptions),
  colors: {
    accentColor,
    accentColorForeground,
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(255, 255, 255, 0.7)",
    closeButtonBackground: "rgba(255, 255, 255, 0.08)",
    connectButtonBackground: "#000",
    connectButtonBackgroundError: "#FF494A",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    menuItemBackground: "rgba(255, 255, 255, 0.08)",
    modalBackdrop: "rgba(0, 0, 0, 0.7)",
    modalBackground: "#000",
    modalBorder: "rgba(255, 255, 255, 0.08)",
    modalText: "#FFF",
    modalTextDim: "rgba(255, 255, 255, 0.4)",
    modalTextSecondary: "rgba(255, 255, 255, 0.64)",
    profileAction: "rgba(255, 255, 255, 0.1)",
    profileActionHover: "rgba(255, 255, 255, 0.2)",
    profileForeground: "rgba(255, 255, 255, 0.06)",
    standby: "#FFD641",
  },
  shadows: {
    connectButton: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
  },
});

midnightTheme.accentColors = accentColors;
