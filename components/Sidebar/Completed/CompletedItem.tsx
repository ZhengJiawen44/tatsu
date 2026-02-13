import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import { Link } from "@/i18n/navigation";

import { useCompletedTodo } from "@/features/completed/query/get-completedTodo";
import useWindowSize from "@/hooks/useWindowSize";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
const CompletedItem = () => {
  const sidebarDict = useTranslations("sidebar")

  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { completedTodos } = useCompletedTodo();

  // Count only todos created today
  const completedTodoCount = completedTodos.length;

  return (
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center border border-transparent font-normal px-2!",
        activeMenu.name === "Completed" &&
        "bg-sidebar-primary",
      )}
    >
      <Link
        prefetch={true}
        href="/app/completed"
        onClick={() => {
          setActiveMenu({ name: "Completed" });
          if (width <= 1266) setShowMenu(false);
        }}
      >
        <CheckCircleIcon
          className={clsx(
            "w-4.5 h-4.5 stroke-muted-foreground",
            activeMenu.name === "Completed" && "stroke-form-foreground-accent",
          )}
        />
        <p className="text-foreground">{sidebarDict("completed")}</p>

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
