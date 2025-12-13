import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { RxCaretDown } from "react-icons/rx";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { MdOutlineLogout } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import { HiOutlineMoon } from "react-icons/hi";
const MenuSidebarItem = () => {
  const [menuClicked, setMenuClicked] = useState(false);
  const { data } = useSession();
  const { setTheme, theme } = useTheme();

  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" });
  };

  return (
    <DropdownMenu
      onOpenChange={() => {
        setMenuClicked(!menuClicked);
      }}
    >
      <DropdownMenuTrigger className="focus:outline-none w-full">
        <div
          className={
            "flex justify-between py-2 px-2 gap-2 mb-3 border-none rounded-lg hover:cursor-pointer hover:bg-border"
          }
        >
          <div className="flex gap-2">
            <BsGear className="w-5 h-5" />
            Settings
          </div>

          <RxCaretDown
            className={clsx(
              "w-6 h-6 transition-transform duration-200",
              menuClicked ? "rotate-180" : "-rotate-0"
            )}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-foreground w-[var(--radix-dropdown-menu-trigger-width)]">
        <DropdownMenuLabel>
          {data?.user?.email || data?.user?.name || "user settings"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          <MdOutlineLogout className="w-6 h-6" />
          Log out
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
          {theme == "light" ? <MdOutlineWbSunny /> : <HiOutlineMoon />}
          Theme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuSidebarItem;
