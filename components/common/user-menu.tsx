"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { User, LogOut, Settings, FolderSync } from "lucide-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";

export function UserMenu() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  const user = useQuery(api.authFunctions.currentUser);

  const handleLogout = async () => {
    await signOut().finally(() => {
      router.push("/");
    });
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Authenticated>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
              <Avatar className="size-8">
                <AvatarImage
                  src={`/api/image-cache?url=${encodeURIComponent(user?.image ?? "")}`}
                  alt={user?.name}
                />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user?.isAnonymous
                    ? "Anonymous User"
                    : user?.email ?? "No email provided"}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user?.isAnonymous ? (
              <DropdownMenuItem onClick={handleLogout}>
                <FolderSync className="mr-2 size-4" />
                <span>Login and sync</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Authenticated>
      <Unauthenticated>
        <Button
          variant="outline"
          onClick={handleLogin}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span>Login</span>
        </Button>
      </Unauthenticated>
    </>
  );
}
