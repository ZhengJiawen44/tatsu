"use client";
import React from "react";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import UserCard from "@/components/Sidebar/User/UserCard";
import VaultItem from "@/components/Sidebar/Vault/VaultItem";
import CalendarItem from "@/components/Sidebar/Calendar/CalendarItem";
import NoteCollapsible from "@/components/Sidebar/Note/NoteCollapsible";
import TodoItem from "@/components/Sidebar/Todo/TodoSidebarItem";
import CompletedItem from "@/components/Sidebar/Completed/CompletedItem";
import MenuSidebarItem from "@/components/Sidebar/Settings/MenuSidebarItem";
import PassKeyProvider from "@/providers/PassKeyProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { Toaster } from "@/components/ui/toaster";
import { useSelectedLayoutSegment } from "next/navigation";
// import AnnouncementBanner from "@/components/AnnouncementBanner";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  const segment = useSelectedLayoutSegment();
  let variant = "default";
  if (segment == "calendar") variant = "fullWidth";

  return (
    <PassKeyProvider>
      <NotificationProvider>
        <div className="flex min-h-screen h-screen">
          <SidebarContainer>
            <UserCard className="mb-3" />
            <div className="flex flex-col gap-2 overflow-y-scroll h-full scrollbar-none">
              <TodoItem />
              <CompletedItem />
              <CalendarItem />
              <NoteCollapsible />
              <VaultItem />
              <Toaster />
            </div>
            <MenuSidebarItem />
          </SidebarContainer>

          <div className="flex flex-col flex-1 z-0">
            <div
              className={clsx(
                variant == "default" &&
                  "lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)]",
                variant == "fullWidth" && "px-[clamp(10px,5%,10%)]",
                "w-full m-auto h-full p-12 overflow-scroll scrollbar-none pt-[4rem]",
                isResizing && "select-none",
              )}
            >
              {!showMenu && <Toaster />}
              {!showMenu && (
                <SidebarToggle className="fixed left-4 md:left-10 top-[6px]">
                  <SidebarIcon className="w-6 h-6" />
                </SidebarToggle>
              )}
              {/* <AnnouncementBanner>
                <p className="mb-1">
                  Thank you for trying out
                  <span className="font-semibold text-white">
                    &nbsp;Tatsu.gg
                  </span>
                  ! We appreciate you exploring our demo and value your
                  feedback.
                </p>
                <p>
                  A special shoutout to
                  <span className="text-yellow-400 font-semibold">
                    &nbsp; JustPowerful Plays &nbsp;
                  </span>
                  for catching an issue where the sidebar toggle shortcut
                  conflicts with the rich text editor’s bold command.
                  <span className="italic"> You have my gratitude.</span>
                </p>
              </AnnouncementBanner> */}
              {children}
            </div>
          </div>
        </div>
      </NotificationProvider>
    </PassKeyProvider>
  );
};

export default Provider;
