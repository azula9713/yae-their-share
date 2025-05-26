"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Image from "next/image";

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  loginTime: string;
  provider?: string;
}

export function UserMenu() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  const user = useQuery(api.authFunctions.currentUser)

  const handleLogout = async () => {
    await signOut().finally(() => {
      router.push("/");
    });
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={handleLogin}>
        <User className="h-4 w-4 mr-2" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-8">
            {/* <AvatarImage
              src={user.image}
              alt={user.name}
            /> */}
            <Image
                src={user.image as string}
                alt={user.name as string}
                width={32}
                height={32}
                className="h-full w-full rounded-full"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
