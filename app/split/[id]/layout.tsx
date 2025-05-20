import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Event Details - Their Share",
  description: "Manage your event expenses and see who owes whom",
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
