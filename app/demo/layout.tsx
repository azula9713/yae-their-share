import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo - Their Share",
  description: "Try a demo of Their Share with sample data",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
