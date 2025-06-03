import { Link, Lock, Share2, Unlock } from "lucide-react";
import Image from "next/image";

import PdfIcon from "@/assets/icons8-adobe-acrobat-reader.svg";
import ExcelIcon from "@/assets/icons8-microsoft-excel-2019.svg";
import useSplit from "@/hooks/split/use-split";
import { useGetCurrentUser } from "@/hooks/user/use-user";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  splitId: string;
};

export default function ShareMenu({ splitId }: Props) {
  const { data: user } = useGetCurrentUser();
  const { split } = useSplit({ splitId });

  if (!split) {
    return null; // or a loading state
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col items-start justify-center gap-2 p-2">
          <DropdownMenuItem className="w-full">
            <Image src={PdfIcon} alt="PDF Icon" className="size-6" />
            <span className="text-sm">Export as PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full">
            <Image src={ExcelIcon} alt="Excel Icon" className="size-6" />
            <span className="text-sm">Export as Excel</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        {!user?.isAnonymous && (
          <>
            <DropdownMenuItem onClick={() => {}}>
              <Link className="mr-2 size-4" />
              <span>Share Split Link</span>
            </DropdownMenuItem>
            {split.isPrivate ? (
              <DropdownMenuItem onClick={() => {}}>
                <Unlock className="mr-2 size-4" />
                <span>Make Split Public</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => {}}>
                <Lock className="mr-2 size-4" />
                <span>Make Split Private</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </>
        )}

        {/* {user?.isAnonymous ? (
          <DropdownMenuItem onClick={handleLogout}>
            <FolderSync className="mr-2 size-4" />
            <span>Login and sync</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
