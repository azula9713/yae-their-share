"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-emerald-600 size-[1.2rem]" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400 size-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-emerald-200 dark:border-emerald-800"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
