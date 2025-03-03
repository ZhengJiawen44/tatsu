"use client";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { useMenu } from "@/providers/MenuProvider";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { showMenu } = useMenu();
  return (
    <div className="m-auto h-full p-5 overflow-scroll scrollbar-none md:w-[70%] lg:w-[60%] xl:w-[50%] pt-[4rem]">
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
