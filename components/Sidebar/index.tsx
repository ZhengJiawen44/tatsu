import React, { useEffect, useState } from "react";
import { TodoItem } from "@/components/Todo/TodoItem";
import LineSeparator from "@/components/ui/lineSeparator";
import Ok from "@/components/ui/icon/ok";
import { useQuery } from "@tanstack/react-query";

interface TodoItemType {
  id: string;
  title: string;
  description?: string;
  pinned: boolean;
  createdAt: Date;
  completed: boolean;
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
  const { data: todoList = [], isLoading } = useQuery<TodoItemType[]>({
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
  return (
    <>
      <h1 className="text-[6rem] font-bold font-mono text-lime w-full h-fit my`-10 text-center rounded-3xl bg-card">
        {time}
      </h1>
      <div className="h-full rounded-3xl bg-card p-16 overflow-y-scroll scrollbar-none">
        <h2 className="flex gap-2 items-center text-[1.4rem]">
          Finished todos <Ok className="w-7 h-7" />
        </h2>
        <LineSeparator />
        {todoList.map((item) => {
          if (item.completed) {
            return (
              <TodoItem
                key={item.id}
                todoItem={item}
                variant="completed-todos"
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default index;
