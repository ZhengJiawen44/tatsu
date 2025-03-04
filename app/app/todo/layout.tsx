"use client";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  return (
    <div
      className={clsx(
        "w-full m-auto h-full p-12 lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)]  overflow-scroll scrollbar-none pt-[4rem]",
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

export default layout;
