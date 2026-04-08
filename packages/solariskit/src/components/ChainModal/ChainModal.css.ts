import { style } from "@vanilla-extract/css";

import { themeVars } from "../../css/sprinkles.css";

export const DesktopScrollClassName = style({
  maxHeight: 456,
  overflowY: "auto",
  overflowX: "hidden",
});

export const MobileScrollClassName = style({
  maxHeight: 456,
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "none",
  selectors: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
});

export const SearchInputClassName = style({
  width: "100%",
  height: "40px",
  borderRadius: themeVars.radii.menuButton,
  border: `1px solid ${themeVars.colors.generalBorder}`,
  background: themeVars.colors.menuItemBackground,
  color: themeVars.colors.modalText,
  font: "inherit",
  padding: "0 14px",
  selectors: {
    "&::placeholder": {
      color: themeVars.colors.modalTextSecondary,
    },
    "&:focus": {
      borderColor: themeVars.colors.selectedOptionBorder,
    },
  },
});
