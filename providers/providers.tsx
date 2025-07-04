import React from "react";

import { AnonymousDataMigrationProvider } from "@/components/providers/anonymous-data-migration-provider";

import { ConvexClientProvider } from "./convex-client-provider";
import { TanStackProviders } from "./tanstack-client-provider";
import { ThemeProvider } from "./theme-provider";

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
          <AnonymousDataMigrationProvider />
          {children}
        </ThemeProvider>
      </TanStackProviders>
    </ConvexClientProvider>
  );
}
