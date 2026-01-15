import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import { useCompletedTodo } from "@/features/completed/query/get-completedTodo";
import useWindowSize from "@/hooks/useWindowSize";
import { CheckCircleIcon } from "lucide-react";

const CompletedItem = () => {
  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { completedTodos } = useCompletedTodo();
  // Get today's date string

  // Count only todos created today
  const completedTodoCount = completedTodos.length;

  return (
    <Link
      href="/app/completed"
      className={clsx(
        "select-none flex gap-3 items-center py-3 px-3 w-full rounded-lg hover:cursor-pointer hover:bg-popover border border-transparent",
        activeMenu.name === "Completed" &&
          "bg-popover-accent shadow-md text-form-foreground-accent !border-border",
      )}
      onClick={() => {
        setActiveMenu({ name: "Completed" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <CheckCircleIcon
        className={clsx(
          "w-5 h-5 stroke-muted-foreground",
          activeMenu.name === "Completed" && "stroke-form-foreground-accent",
        )}
      />
      Complete
      <p
        className={clsx(
          "mr-0 ml-auto",
          activeMenu.name === "Todo"
            ? "text-card-foreground"
            : "text-card-foreground-muted",
        )}
      >
        <span
          className={clsx(
            "mr-0 ml-auto px-2 py-0.5 rounded-full text-xs font-medium min-w-[24px] text-center",
            activeMenu.name === "Completed"
              ? "bg-popover-accent text-form-foreground-accent"
              : "bg-popover text-card-foreground-muted",
          )}
        >
          {completedTodoCount}
        </span>
      </p>
    </Link>
  );
};

export default CompletedItem;
