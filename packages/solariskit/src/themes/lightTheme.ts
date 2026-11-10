import { type AccentColor, type AccentColorPreset, type ThemeOptions, baseTheme } from "./baseTheme";

const accentColors: Record<AccentColorPreset, AccentColor> = {
  blue: { accentColor: "#0A66E0", accentColorForeground: "#FFF" },
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
    actionButtonBorder: "rgba(0, 0, 0, 0.04)",
    actionButtonBorderMobile: "rgba(0, 0, 0, 0.06)",
    actionButtonSecondaryBackground: "#F2F3F5",
    closeButton: "#6B7280",
    closeButtonBackground: "#F2F3F5",
    connectButtonBackground: "#FFF",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",
    connectButtonText: "#111827",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",
    error: "#FF494A",
    generalBorder: "#EEF0F2",
    generalBorderDim: "rgba(0, 0, 0, 0.03)",
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
    selectedOptionBorder: "rgba(60, 66, 66, 0.1)",
    standby: "#FFD641",
  },
  shadows: {
    connectButton: "inset 0 0 0 1px #E5E7EB",
    dialog: "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 8px 32px rgba(0, 0, 0, 0.12)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.12)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
  },
});

lightTheme.accentColors = accentColors;
