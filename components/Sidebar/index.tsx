import React, { useEffect, useState } from "react";
import TodoSidebar from "./TodoSidebar";
import { useQuery } from "@tanstack/react-query";
import NoteSidebar from "./NoteSidebar";

interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  createdAt: Date;
  completed: boolean;
}
interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}
const index = ({ activeMenu }: { activeMenu: string }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    // Update immediately
    updateClock();

    // Calculate ms until next minute
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // Initial timeout to sync with minute changes
    const initialTimeout = setTimeout(() => {
      updateClock();
      // Then set up the interval for subsequent updates
      const interval = setInterval(updateClock, 60000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  // query todo data
  const { data: todoList = [] } = useQuery<TodoItemType[]>({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await fetch(`/api/todo`);
      if (!res.ok) throw new Error("Failed to fetch todos");

      const data = await res.json();

      return Array.isArray(data.todos)
        ? data.todos.map((todo: TodoItemType) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }))
        : [];
    },
  });

  // query note data
  const { data: noteList = [] } = useQuery<NoteItemType[]>({
    queryKey: ["note"],
    queryFn: async () => {
      const res = await fetch(`/api/note`);
      if (!res.ok) throw new Error("Failed to fetch notes");

      const data = await res.json();

      return Array.isArray(data.notes)
        ? data.notes.map((note: NoteItemType) => ({
            ...note,
            createdAt: new Date(note.createdAt),
          }))
        : [];
    },
  });
  return (
    <>
      <h1 className="text-[6rem] font-bold font-mono text-lime w-full h-fit my`-10 text-center rounded-3xl bg-card">
        {time}
      </h1>
      <div className="h-full rounded-3xl bg-card p-16 overflow-y-scroll scrollbar-none">
        {activeMenu === "Todo" && <TodoSidebar todoList={todoList} />}
        {activeMenu === "Vault" && <>Vault</>}
        {activeMenu === "Note" && <NoteSidebar noteList={noteList} />}
      </div>
    </>
  );
};

export default index;
