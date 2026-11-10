import React from "react";

const strokeProps = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.75,
} as const;

export const WalletIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    aria-hidden
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
  >
    <path
      {...strokeProps}
      d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5.5A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18.5 7H5.5A2.5 2.5 0 0 1 3 4.5"
    />
    <circle
      cx="16.5"
      cy="13.5"
      fill="currentColor"
      r="1.25"
    />
  </svg>
);

export const SignatureIcon = () => (
  <svg
    aria-hidden
    fill="none"
    height="32"
    viewBox="0 0 24 24"
    width="32"
  >
    <path
      {...strokeProps}
      d="M15.5 4.5l4 4L9 19H5v-4L15.5 4.5zM13 7l4 4M4 22h16"
    />
  </svg>
);
