"use client";
import React from "react";
import SidebarContainer from "./Sidebar/SidebarContainer";
import UserCard from "./Sidebar/User/UserCard";
import VaultItem from "./Sidebar/Vault/VaultItem";
import NoteCollapsible from "./Sidebar/Note/NoteCollapsible";
import TodoItem from "./Sidebar/Todo/TodoSidebarItem";
import CompletedItem from "./Sidebar/Completed/CompletedItem";
import PassKeyProvider from "@/providers/PassKeyProvider";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import SidebarToggle from "./ui/SidebarToggle";
import SidebarIcon from "./ui/icon/sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  return (
    <PassKeyProvider>
      <div className="flex min-h-screen h-screen">
        <SidebarContainer>
          <UserCard className="mb-3" />
          <TodoItem />
          <CompletedItem />
          <NoteCollapsible />
          <VaultItem />
        </SidebarContainer>
        <div className="flex flex-col flex-1 z-0">
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
        </div>
      </div>
    </PassKeyProvider>
  );
};

export default AppLayout;
