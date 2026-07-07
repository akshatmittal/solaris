import type { ReactNode } from "react";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris Example",
  description: "Next.js example app wired to the Ethereum and Solana SolarisKit entrypoints.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
