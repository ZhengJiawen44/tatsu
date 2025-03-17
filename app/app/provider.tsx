"use client";
import React from "react";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import UserCard from "@/components/Sidebar/User/UserCard";
import VaultItem from "@/components/Sidebar/Vault/VaultItem";
import NoteCollapsible from "@/components/Sidebar/Note/NoteCollapsible";
import TodoItem from "@/components/Sidebar/Todo/TodoSidebarItem";
import CompletedItem from "@/components/Sidebar/Completed/CompletedItem";
import PassKeyProvider from "@/providers/PassKeyProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { Toaster } from "@/components/ui/toaster";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  return (
    <PassKeyProvider>
      <NotificationProvider>
        <div className="flex min-h-screen h-screen">
          <SidebarContainer>
            <UserCard className="mb-3" />
            <TodoItem />
            <CompletedItem />
            <NoteCollapsible />
            <VaultItem />
            <Toaster />
          </SidebarContainer>
          <div className="flex flex-col flex-1 z-0">
            <div
              className={clsx(
                "w-full m-auto h-full p-12 lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)]  overflow-scroll scrollbar-none pt-[4rem]",
                isResizing && "select-none"
              )}
            >
              {!showMenu && <Toaster />}
              {!showMenu && (
                <SidebarToggle className="fixed left-4 md:left-10 top-[10px]">
                  <SidebarIcon className="w-6 h-6" />
                </SidebarToggle>
              )}
              {children}
            </div>
          </div>
        </div>
      </NotificationProvider>
    </PassKeyProvider>
  );
};

export default Provider;
