"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/noBgColor.png";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="border-b border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-rose-900/20">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="Their Share Logo" className="h-8 w-auto" />
            <span className="sr-only">Their Share</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
