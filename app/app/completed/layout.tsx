"use client";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";

import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  return (
    <div
      className={clsx(
        "m-auto h-full p-5 overflow-scroll scrollbar-none w-[55rem] pt-[4rem]",
        isResizing && "select-none"
      )}
    >
      {!showMenu && (
        <SidebarToggle className="fixed left-4 md:left-10 top-[10px]">
          <SidebarIcon className="w-6 h-6" />
        </SidebarToggle>
      )}
      {children}
    </div>
  );
};

export default Layout;
