import type { Metadata } from "next";

import SubHeader from "@/components/common/sub-header";

export const metadata: Metadata = {
  title: "Split Details - Their Share",
  description: "Manage your expenses and see who owes whom",
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <SubHeader />
      {children}
    </div>
  );
}
