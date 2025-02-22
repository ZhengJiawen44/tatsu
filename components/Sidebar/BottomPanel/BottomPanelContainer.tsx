import React from "react";
import { useQuery } from "@tanstack/react-query";
import TodoSidebar from "./TodoSidebar/TodoSidebarContainer";
import NoteSidebar from "./NoteSidebar/NoteSidebarContainer";
import { NoteItemType } from "@/types";
import { useTodo } from "@/hooks/useTodo";

const BottomPanel = ({ activeMenu }: { activeMenu: string }) => {
  // query todo data
  const { todos } = useTodo();

  // query note data
  const { data: noteList = [] } = useQuery<NoteItemType[]>({
    queryKey: ["note"],
    queryFn: async () => {
      const res = await fetch(`/api/note`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      return data.notes;
    },
  });
  return (
    <>
      <div className="h-full rounded-3xl bg-card p-16 overflow-y-scroll scrollbar-none">
        {activeMenu === "Todo" && <TodoSidebar todoList={todos} />}
        {activeMenu === "Vault" && <>Vault</>}
        {activeMenu === "Note" && <NoteSidebar noteList={noteList} />}
      </div>
    </>
  );
};

export default BottomPanel;
