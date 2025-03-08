import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import Pencil from "@/components/ui/icon/pencil";
import { useTodo } from "@/hooks/useTodo";
import isToday from "@/lib/date/isToday";

const TodoItem = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const { todos } = useTodo();
  // Get today's date string

  // Count only todos created today
  const todayTodoCount = todos
    ? todos.filter(({ createdAt, completed }) => {
        return isToday(createdAt) && !completed;
      }).length
    : 0;

  return (
    <Link
      href="/app/todo"
      className={clsx(
        "select-none flex gap-1 items-center py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted",
        activeMenu.name === "Todo" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Todo" });
        localStorage.setItem("tab", JSON.stringify({ name: "Todo" }));
      }}
    >
      <Pencil className="w-5 h-5 mb-[1px]" />
      Today
      <p
        className={clsx(
          "mr-0 ml-auto",
          activeMenu.name === "Todo"
            ? "text-card-foreground"
            : "text-card-foreground-muted"
        )}
      >
        {todayTodoCount}
      </p>
    </Link>
  );
};

export default TodoItem;
