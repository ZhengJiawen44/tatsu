import clsx from "clsx";
import React from "react";
import OK from "@/components/ui/icon/ok";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import { useTodo } from "@/features/todos/api/get-todo";

const CompletedItem = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  const { todos } = useTodo();
  // Get today's date string

  // Count only todos created today
  const completedTodoCount = todos
    ? todos.filter(({ completed }) => {
        return completed;
      }).length
    : 0;
  return (
    <Link
      href="/app/completed"
      className={clsx(
        "select-none flex items-center py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted gap-1",
        activeMenu.name === "Completed" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Completed" });
      }}
    >
      <OK className="w-5 h-5" />
      Complete
      <p
        className={clsx(
          "mr-0 ml-auto",
          activeMenu.name === "Todo"
            ? "text-card-foreground"
            : "text-card-foreground-muted"
        )}
      >
        {completedTodoCount}
      </p>
    </Link>
  );
};

export default CompletedItem;
