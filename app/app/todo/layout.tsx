"use client";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { useMenu } from "@/providers/MenuProvider";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, setShowMenu } = useMenu();
  return (
    <div
      className="w-full h-full p-5  overflow-scroll scrollbar-none"
      style={{
        paddingLeft: "max(4rem, min(20%, 24rem))",
        paddingRight: "max(4rem, min(20%, 24rem))",
      }}
    >
      {!showMenu && (
        <SidebarToggle className="fixed left-10 top-[10px]">
          <SidebarIcon className="w-6 h-6" />
        </SidebarToggle>
      )}
      {children}
    </div>
  );
};

export default layout;
