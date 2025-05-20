import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split Details - Their Share",
  description: "Manage your expenses and see who owes whom",
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
