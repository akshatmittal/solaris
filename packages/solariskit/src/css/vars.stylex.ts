import * as stylex from "@stylexjs/stylex";

// Theme values live in `--solaris-*` custom properties set by the provider (see cssObjectFromTheme).
export const colors = stylex.defineConsts({
  accentColor: "var(--solaris-colors-accentColor)",
  accentColorForeground: "var(--solaris-colors-accentColorForeground)",
  accentSoft: "color-mix(in srgb, var(--solaris-colors-accentColor) 10%, transparent)",
  // Trigger hover fills: the surface with 8% of its text color mixed in.
  accentHover: "color-mix(in srgb, var(--solaris-colors-accentColorForeground) 8%, var(--solaris-colors-accentColor))",
  actionButtonSecondaryBackground: "var(--solaris-colors-actionButtonSecondaryBackground)",
  closeButton: "var(--solaris-colors-closeButton)",
  closeButtonBackground: "var(--solaris-colors-closeButtonBackground)",
  connectButtonBackground: "var(--solaris-colors-connectButtonBackground)",
  connectButtonBackgroundError: "var(--solaris-colors-connectButtonBackgroundError)",
  connectButtonErrorHover:
    "color-mix(in srgb, var(--solaris-colors-connectButtonTextError) 8%, var(--solaris-colors-connectButtonBackgroundError))",
  connectButtonHover:
    "color-mix(in srgb, var(--solaris-colors-connectButtonText) 8%, var(--solaris-colors-connectButtonBackground))",
  connectButtonText: "var(--solaris-colors-connectButtonText)",
  connectButtonTextError: "var(--solaris-colors-connectButtonTextError)",
  connectionIndicator: "var(--solaris-colors-connectionIndicator)",
  error: "var(--solaris-colors-error)",
  generalBorder: "var(--solaris-colors-generalBorder)",
  menuItemBackground: "var(--solaris-colors-menuItemBackground)",
  modalBackdrop: "var(--solaris-colors-modalBackdrop)",
  modalBackground: "var(--solaris-colors-modalBackground)",
  modalBorder: "var(--solaris-colors-modalBorder)",
  modalText: "var(--solaris-colors-modalText)",
  modalTextDim: "var(--solaris-colors-modalTextDim)",
  modalTextSecondary: "var(--solaris-colors-modalTextSecondary)",
  profileAction: "var(--solaris-colors-profileAction)",
  profileActionHover: "var(--solaris-colors-profileActionHover)",
  profileForeground: "var(--solaris-colors-profileForeground)",
  standby: "var(--solaris-colors-standby)",
  success: "#16A34A",
});

export const fonts = stylex.defineConsts({
  body: "var(--solaris-fonts-body)",
});

export const radii = stylex.defineConsts({
  actionButton: "var(--solaris-radii-actionButton)",
  connectButton: "var(--solaris-radii-connectButton)",
  menuButton: "var(--solaris-radii-menuButton)",
  modal: "var(--solaris-radii-modal)",
  modalMobile: "var(--solaris-radii-modalMobile)",
});

export const shadows = stylex.defineConsts({
  connectButton: "var(--solaris-shadows-connectButton)",
  dialog: "var(--solaris-shadows-dialog)",
});

export const blurs = stylex.defineConsts({
  modalOverlay: "var(--solaris-blurs-modalOverlay)",
});

// One duration set for every transition and animation. Exits are faster than entries.
export const motion = stylex.defineConsts({
  enter: "150ms",
  exit: "100ms",
  fast: "100ms",
  press: "160ms",
  sheetEnter: "200ms",
  // The longest exit. The unmount timer in Dialog.tsx uses the same value.
  sheetExit: "150ms",
  pulse: "1s",
  spin: "750ms",
  easeOut: "cubic-bezier(0.23, 1, 0.32, 1)",
  // iOS sheet curve.
  easeDrawer: "cubic-bezier(0.32, 0.72, 0, 1)",
});

export const media = stylex.defineConsts({
  largeScreen: "@media screen and (min-width: 768px)",
  // Touch screens keep :hover after a tap.
  hover: "@media (hover: hover) and (pointer: fine)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  coarsePointer: "@media (pointer: coarse)",
});
