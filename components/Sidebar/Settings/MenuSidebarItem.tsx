import React, { useState } from "react";
import { Settings as Gear } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import KeyboardShortcuts from "@/components/KeyboardShortcut";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { ArrowUpLeft } from "lucide-react";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
const ConfirmLogoutModal = dynamic(() => import("./ConfirmLogoutModal"));
const MenuSidebarItem = () => {
  const sidebarDict = useTranslations("sidebar")

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data } = useSession();
  const { setTheme, theme } = useTheme();
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="focus:outline-hidden w-full" asChild>
          <Button
            variant={"ghost"}
            className={"flex justify-between py-2 px-2 gap-2 mb-3 font-normal"}
          >
            <div className="flex gap-3">
              <Gear className="w-5 h-5 text-muted-foreground" />
              {sidebarDict("settings")}
            </div>
            <ChevronDown
              className={clsx(
                "w-6 h-6 transition-transform duration-200",
                dropdownOpen ? "rotate-180" : "rotate-0",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-foreground w-(--radix-dropdown-menu-trigger-width)">
          <DropdownMenuLabel>
            {data?.user?.email || data?.user?.name || "user settings"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
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
              setDropdownOpen(false);
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

export default MenuSidebarItem;
