
import AnonymousUserManager from "./anonymous-user-manager";
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
          <AnonymousUserManager />
          {children}
        </ThemeProvider>
      </TanStackProviders>
    </ConvexClientProvider>
  );
}
