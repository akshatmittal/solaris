import type { ReactNode } from "react";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Solaris Example",
  description: "Next.js example app wired to the Ethereum and Solana SolarisKit entrypoints.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={inter.variable}
      lang="en"
    >
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
