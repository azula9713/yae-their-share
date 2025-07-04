"use client";

import React from "react";

import { useAnonymousUserManager } from "@/hooks/user/use-anonymous-data-migration";

import { ConvexClientProvider } from "./convex-client-provider";
import { TanStackProviders } from "./tanstack-client-provider";
import { ThemeProvider } from "./theme-provider";

// Internal component to run the anonymous user migration logic
function AnonymousUserManager() {
  useAnonymousUserManager();
  return null;
}

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ConvexClientProvider>
      <TanStackProviders>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnonymousUserManager />
          {children}
        </ThemeProvider>
      </TanStackProviders>
    </ConvexClientProvider>
  );
}
