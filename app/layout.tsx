import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import type React from "react";

import Header from "@/components/common/header";
import Providers from "@/providers/providers";

import "./globals.css";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Their Share - Split Expenses Fairly",
  description: "Split expenses fairly with friends and family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={lexend.className}>
          <Providers>
            <div className="flex flex-col mx-auto">
              <Header />
              <main className="flex-1 max-h-[calc(100svh-calc(var(--spacing)*16))]">
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
