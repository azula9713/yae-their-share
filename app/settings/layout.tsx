import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Their Share",
  description: "Customize your expense tracking preferences and settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
