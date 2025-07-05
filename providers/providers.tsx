import AnonymousUserManager from "./anonymous-user-manager";
import { ConvexClientProvider } from "./convex-client-provider";
import { TanStackProviders } from "./tanstack-client-provider";
import { ThemeProvider } from "./theme-provider";
import { SyncProvider } from "./sync-provider";

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
          <SyncProvider
            convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!}
            syncIntervalMs={5000}
            conflictResolution="server-wins"
          >
            <AnonymousUserManager />
            {children}
          </SyncProvider>
        </ThemeProvider>
      </TanStackProviders>
    </ConvexClientProvider>
  );
}
