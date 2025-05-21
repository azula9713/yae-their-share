"use client";

import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";

import LightLogo from "@/assets/theirsharelogo.png";
import DarkLogo from "@/assets/theirsharelogodark.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme } = useTheme();

  const [logo, setLogo] = useState(LightLogo);

  const handleThemeChange = (newTheme: string) => {
    setLogo(newTheme === "dark" ? DarkLogo : LightLogo);
  };
  

  useEffect(() => {
    if (theme) {
      handleThemeChange(theme);
    }
  }, [theme]);


  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Their Share Logo"
            className="h-8 w-auto"
          />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
