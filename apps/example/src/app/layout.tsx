import type { ReactNode } from "react";

import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "Solaris Example",
  description: "Next.js example app wired to the local RainbowKit workspace package.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
