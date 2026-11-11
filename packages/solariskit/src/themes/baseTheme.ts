import type { ThemeVars } from "../css/themeVars";

// Source: https://css-tricks.com/snippets/css/system-font-stack
// Note that quotes have been removed to avoid escaping and server/client mismatch issues
const systemFontStack =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const fontStacks = {
  inherit: "inherit",
  rounded: `SFRounded, ui-rounded, "SF Pro Rounded", ${systemFontStack}`,
  system: systemFontStack,
} as const;
type FontStack = keyof typeof fontStacks;

type RadiusScale = "large" | "medium" | "small" | "none";
const radiusScales: Record<
  RadiusScale,
  {
    actionButton: string;
    connectButton: string;
    modal: string;
    modalMobile: string;
  }
> = {
  large: {
    actionButton: "12px",
    connectButton: "12px",
    modal: "24px",
    modalMobile: "24px",
  },
  medium: {
    actionButton: "10px",
    connectButton: "10px",
    modal: "18px",
    modalMobile: "20px",
  },
  none: {
    actionButton: "0px",
    connectButton: "0px",
    modal: "0px",
    modalMobile: "0px",
  },
  small: {
    actionButton: "4px",
    connectButton: "4px",
    modal: "8px",
    modalMobile: "8px",
  },
};

type Blurs = "large" | "small" | "none";
const blurs: Record<
  Blurs,
  {
    modalOverlay: string;
  }
> = {
  large: {
    modalOverlay: "blur(20px)",
  },
  none: {
    modalOverlay: "blur(0px)",
  },
  small: {
    modalOverlay: "blur(4px)",
  },
};

interface BaseThemeOptions {
  borderRadius?: RadiusScale;
  fontStack?: FontStack;
  overlayBlur?: Blurs;
}

export const baseTheme = ({
  borderRadius = "large",
  fontStack = "inherit",
  overlayBlur = "none",
}: BaseThemeOptions): Pick<ThemeVars, "radii" | "fonts" | "blurs"> => ({
  blurs: {
    modalOverlay: blurs[overlayBlur].modalOverlay,
  },
  fonts: {
    body: fontStacks[fontStack],
  },
  radii: {
    actionButton: radiusScales[borderRadius].actionButton,
    connectButton: radiusScales[borderRadius].connectButton,
    menuButton: radiusScales[borderRadius].connectButton,
    modal: radiusScales[borderRadius].modal,
    modalMobile: radiusScales[borderRadius].modalMobile,
  },
});

export interface AccentColor {
  accentColor: string;
  accentColorForeground: string;
}

export type AccentColorPreset = "blue" | "green" | "red" | "purple" | "pink" | "orange";

export interface ThemeOptions extends BaseThemeOptions {
  accentColor?: string;
  accentColorForeground?: string;
}
