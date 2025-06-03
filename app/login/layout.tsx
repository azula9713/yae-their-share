import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Login - Their Share",
  description: "Login to sync your expense data across devices",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
