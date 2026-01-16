import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import { useTodo } from "@/features/todos/query/get-todo";
import useWindowSize from "@/hooks/useWindowSize";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center border border-transparent",
        activeMenu.name === "Todo" &&
          "bg-sidebar-primary shadow-md !border-border",
      )}
    >
      <Link
        href="/app/todo"
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
        <p>Today</p>

        <span
          className={clsx(
            "mr-0 ml-auto px-2 py-0.5 rounded-full text-xs font-medium min-w-[24px] text-center truncate",
            activeMenu.name === "Completed"
              ? "text-muted-foreground"
              : "bg-border brightness-110",
          )}
        >
          {todayTodoCount}
        </span>
      </Link>
    </Button>
  );
};

export default TodoItem;
