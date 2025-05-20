"use client";

import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";

import LightLogo from "@/assets/theirsharelogo.png";
import DarkLogo from "@/assets/theirsharelogodark.png";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center">
          <Image
            src={theme === "dark" ? DarkLogo : LightLogo}
            alt="Their Share Logo"
            className="h-8 w-auto"
          />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
