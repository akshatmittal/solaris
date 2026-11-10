import * as stylex from "@stylexjs/stylex";

// Theme values live in `--rk-*` custom properties set by the provider (see cssObjectFromTheme).
export const colors = stylex.defineConsts({
  accentColor: "var(--rk-colors-accentColor)",
  accentColorForeground: "var(--rk-colors-accentColorForeground)",
  accentSoft: "color-mix(in srgb, var(--rk-colors-accentColor) 10%, transparent)",
  actionButtonSecondaryBackground: "var(--rk-colors-actionButtonSecondaryBackground)",
  closeButton: "var(--rk-colors-closeButton)",
  closeButtonBackground: "var(--rk-colors-closeButtonBackground)",
  connectButtonBackground: "var(--rk-colors-connectButtonBackground)",
  connectButtonBackgroundError: "var(--rk-colors-connectButtonBackgroundError)",
  connectButtonInnerBackground: "var(--rk-colors-connectButtonInnerBackground)",
  connectButtonText: "var(--rk-colors-connectButtonText)",
  connectButtonTextError: "var(--rk-colors-connectButtonTextError)",
  connectionIndicator: "var(--rk-colors-connectionIndicator)",
  error: "var(--rk-colors-error)",
  generalBorder: "var(--rk-colors-generalBorder)",
  generalBorderDim: "var(--rk-colors-generalBorderDim)",
  hairline: "color-mix(in srgb, var(--rk-colors-modalText) 8%, transparent)",
  menuItemBackground: "var(--rk-colors-menuItemBackground)",
  modalBackdrop: "var(--rk-colors-modalBackdrop)",
  modalBackground: "var(--rk-colors-modalBackground)",
  modalBorder: "var(--rk-colors-modalBorder)",
  modalText: "var(--rk-colors-modalText)",
  modalTextDim: "var(--rk-colors-modalTextDim)",
  modalTextSecondary: "var(--rk-colors-modalTextSecondary)",
  profileAction: "var(--rk-colors-profileAction)",
  profileActionHover: "var(--rk-colors-profileActionHover)",
  profileForeground: "var(--rk-colors-profileForeground)",
  standby: "var(--rk-colors-standby)",
  success: "#16A34A",
});

export const fonts = stylex.defineConsts({
  body: "var(--rk-fonts-body)",
});

export const radii = stylex.defineConsts({
  actionButton: "var(--rk-radii-actionButton)",
  connectButton: "var(--rk-radii-connectButton)",
  menuButton: "var(--rk-radii-menuButton)",
  modal: "var(--rk-radii-modal)",
  modalMobile: "var(--rk-radii-modalMobile)",
});

export const shadows = stylex.defineConsts({
  connectButton: "var(--rk-shadows-connectButton)",
  dialog: "var(--rk-shadows-dialog)",
  walletLogo: "var(--rk-shadows-walletLogo)",
});

export const blurs = stylex.defineConsts({
  modalOverlay: "var(--rk-blurs-modalOverlay)",
});

export const media = stylex.defineConsts({
  largeScreen: "@media screen and (min-width: 768px)",
});
