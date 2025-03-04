"use client";
import React from "react";
import SidebarContainer from "./Sidebar/SidebarContainer";
import UserCard from "./Sidebar/User/UserCard";
import VaultItem from "./Sidebar/Vault/VaultItem";
import NoteCollapsible from "./Sidebar/Note/NoteCollapsible";
import TodoItem from "./Sidebar/Todo/TodoItem";
import CompletedItem from "./Sidebar/Completed/CompletedItem";
import PassKeyProvider from "@/providers/PassKeyProvider";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
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
        <div className="flex flex-col flex-1 z-0">{children}</div>
      </div>
    </PassKeyProvider>
  );
};

export default AppLayout;
