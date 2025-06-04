import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
