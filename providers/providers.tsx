import React from "react";
import { TanStackProviders } from "./tanstack-client-provider";
import { ConvexClientProvider } from "./convex-client-provider";
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
          {children}
        </ThemeProvider>
      </TanStackProviders>
    </ConvexClientProvider>
  );
}
