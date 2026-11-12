import { type AccentColor, type AccentColorPreset, type ThemeOptions, baseTheme } from "./baseTheme";

const accentColors: Record<AccentColorPreset, AccentColor> = {
  blue: { accentColor: "#007AFF", accentColorForeground: "#FFF" },
  green: { accentColor: "#1DB847", accentColorForeground: "#FFF" },
  orange: { accentColor: "#FF801F", accentColorForeground: "#FFF" },
  pink: { accentColor: "#FF5CA0", accentColorForeground: "#FFF" },
  purple: { accentColor: "#5F5AFA", accentColorForeground: "#FFF" },
  red: { accentColor: "#FA423C", accentColorForeground: "#FFF" },
};

const defaultAccentColor = accentColors.blue;

export const lightTheme = ({
  accentColor = defaultAccentColor.accentColor,
  accentColorForeground = defaultAccentColor.accentColorForeground,
  ...baseThemeOptions
}: ThemeOptions = {}) => ({
  ...baseTheme(baseThemeOptions),
  colors: {
    accentColor,
    accentColorForeground,
    actionButtonSecondaryBackground: "#F2F3F5",
    closeButton: "#6B7280",
    closeButtonBackground: "#F2F3F5",
    connectButtonBackground: "#FFF",
    connectButtonBackgroundError: "#FF494A",
    connectButtonText: "#111827",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    error: "#FF494A",
    generalBorder: "#EEF0F2",
    menuItemBackground: "#F3F4F6",
    modalBackdrop: "rgba(15, 17, 20, 0.4)",
    modalBackground: "#FFF",
    modalBorder: "transparent",
    modalText: "#111827",
    modalTextDim: "#9CA3AF",
    modalTextSecondary: "#6B7280",
    profileAction: "#F3F4F6",
    profileActionHover: "#E5E7EB",
    profileForeground: "#F9FAFB",
    standby: "#FFD641",
  },
  shadows: {
    connectButton: "inset 0 0 0 1px #E5E7EB",
    dialog: "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 8px 32px rgba(0, 0, 0, 0.12)",
  },
});

lightTheme.accentColors = accentColors;
