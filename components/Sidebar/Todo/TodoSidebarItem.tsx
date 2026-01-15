import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import { useTodo } from "@/features/todos/query/get-todo";
import useWindowSize from "@/hooks/useWindowSize";
import { Sun } from "lucide-react";

const TodoItem = () => {
  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { todos } = useTodo();
  // Get today's date string

  // const today = new Date();
  const todayTodoCount = todos.length;
  // Count only todos created today
  // const todayTodoCount = todos
  //   ? todos.filter(({ expiresAt, startedAt, completed }) => {
  //       return (
  //         today.getTime() <= expiresAt.getTime() &&
  //         !completed &&
  //         today.getTime() >= startedAt.getTime()
  //       );
  //     }).length
  //   : 0;

  return (
    <Link
      href="/app/todo"
      className={clsx(
        "select-none flex gap-3 items-center py-3 px-3 w-full rounded-lg hover:cursor-pointer hover:bg-popover border border-transparent",
        activeMenu.name === "Todo" &&
          "bg-popover-accent shadow-md text-form-foreground-accent !border-border",
      )}
      onClick={() => {
        setActiveMenu({ name: "Todo" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <Sun
        className={clsx(
          "w-5 h-5 stroke-muted-foreground",
          activeMenu.name === "Todo" && "stroke-form-foreground-accent",
        )}
      />
      Today
      <span
        className={clsx(
          "mr-0 ml-auto px-2 py-0.5 rounded-full text-xs font-medium min-w-[24px] text-center",
          activeMenu.name === "Todo"
            ? "bg-popover-accent text-card-foreground"
            : "bg-popover text-card-foreground-muted",
        )}
      >
        {todayTodoCount}
      </span>
    </Link>
  );
};

export default TodoItem;
