"use client";

import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/TheirShareFullLogo.png";
import NoTextLogo from "@/assets/TheirShareIcon.png";

import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { SyncIndicator } from "@/components/sync/sync-status";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image
              src={NoTextLogo}
              alt="Their Share Icon"
              className="h-8 w-auto md:hidden"
            />
            <Image
              src={Logo}
              alt="Their Share Logo"
              className="h-8 w-auto hidden md:inline"
            />
            <span className="sr-only">Their Share</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <SyncIndicator />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
