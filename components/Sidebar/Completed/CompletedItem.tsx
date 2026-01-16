import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import { useCompletedTodo } from "@/features/completed/query/get-completedTodo";
import useWindowSize from "@/hooks/useWindowSize";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompletedItem = () => {
  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { completedTodos } = useCompletedTodo();
  // Get today's date string

  // Count only todos created today
  const completedTodoCount = completedTodos.length;

  return (
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center border border-transparent",
        activeMenu.name === "Completed" &&
          "bg-sidebar-primary shadow-md !border-border",
      )}
    >
      <Link
        href="/app/completed"
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
        <p>Complete</p>

        <span
          className={clsx(
            "mr-0 ml-auto px-2 py-0.5 rounded-full text-xs font-medium min-w-[24px] text-center truncate",
            activeMenu.name === "Completed"
              ? "text-muted-foreground"
              : "bg-border brightness-110",
          )}
        >
          {completedTodoCount}
        </span>
      </Link>
    </Button>
  );
};

export default CompletedItem;
