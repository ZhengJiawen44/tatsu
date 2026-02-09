import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserCardLoading from "./UserCardLoading";
import SidebarIcon from "@/components/ui/SidebarToggle";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ArrowUpLeft, LogOut, Moon, Sun } from "lucide-react";
import ConfirmLogoutModal from "../Settings/ConfirmLogoutModal";
import KeyboardShortcuts from "@/components/KeyboardShortcut";

const UserCard = ({ className }: { className?: string }) => {
  const { data, status } = useSession();
  const sidebarDict = useTranslations("sidebar");
  const { setTheme, theme } = useTheme();
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  if (status === "loading") return <UserCardLoading />;
  if (!data) return redirect("/login");

  const { user } = data;

  return (
    <>
      {showLogoutModal && (
        <ConfirmLogoutModal
          logoutDialogOpen={showLogoutModal}
          setLogoutDialogOpen={setShowLogoutModal}
        />
      )}
      {showShortcutModal && (
        <KeyboardShortcuts
          open={showShortcutModal}
          onOpenChange={setShowShortcutModal}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "my-3 flex gap-2 items-center rounded-lg py-2 px-2 transition-all duration-200",
              className,
            )}
          >
            <div className="overflow-hidden w-full flex gap-3 justify-start items-center select-none hover:bg-popover-accent p-1 rounded-md">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt={user?.name || "User profile picture"}
                  width={32}
                  height={32}
                  sizes="32px"
                  className="rounded-md"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded-sm bg-lime"></div>
              )}

              <div className="flex flex-col gap-0.75">
                <p className=" truncate font-medium">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="truncate text-muted-foreground  text-xs">
                  {user?.email}
                </p>
              </div>
            </div>
            <SidebarIcon className="text-muted-foreground hover:text-foreground relative" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-foreground w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuLabel>
            {data?.user?.email || data?.user?.name || "user settings"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowLogoutModal(true);
            }}
          >
            <LogOut className="w-6 h-6" />
            {sidebarDict("settingMenu.logout")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              if (theme == "dark") {
                setTheme("light");
              } else {
                setTheme("dark");
              }
            }}
          >
            {theme == "light" ? <Sun /> : <Moon />}
            {sidebarDict("settingMenu.theme")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setShowShortcutModal(true);
            }}
          >
            <ArrowUpLeft />
            {sidebarDict("settingMenu.shortcuts")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
};

export default UserCard;
