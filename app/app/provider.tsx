"use client";
import React, { useEffect, useState } from "react";
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
import Plus from "@/components/ui/icon/plus";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  const [showNotification, setShowNotification] = useState(() => {
    return JSON.parse(localStorage.getItem("showNotification") || "true");
  });

  useEffect(() => {
    localStorage.setItem("showNotification", JSON.stringify(showNotification));
  }, [showNotification]);
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
              <div
                className={clsx(
                  "relative w-full my-4 rounded-lg border border-gray-700 bg-gray-800 p-4 text-[0.9rem] text-gray-300 shadow-md",
                  !showNotification && "hidden"
                )}
              >
                <div className="pr-8">
                  <p className="mb-1">
                    Thank you for trying out
                    <span className="font-semibold text-white">Tatsu.gg</span>!
                    We appreciate you exploring our demo and value your
                    feedback.
                  </p>
                  <p>
                    A special shoutout to
                    <span className="text-yellow-400 font-semibold">
                      JustPowerful Plays
                    </span>
                    for catching an issue where the sidebar toggle shortcut
                    conflicts with the rich text editor’s bold command.
                    <span className="italic"> You have my gratitude.</span>
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                  onClick={() => setShowNotification(false)}
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </NotificationProvider>
    </PassKeyProvider>
  );
};

export default Provider;
