import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import { Link } from "@/i18n/navigation";

import { useTodo } from "@/features/todayTodos/query/get-todo";
import useWindowSize from "@/hooks/useWindowSize";
import { Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import SidebarItem from "../SidebarItem";
const TodoItem = () => {
  const appDict = useTranslations("app");

  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  const { todos } = useTodo();
  const todayTodoCount = todos.length;

  return (

      <SidebarItem asChild className={activeMenu.name === "Todo" ? "bg-sidebar-primary":""}>

      <Link
        prefetch={true}
        href="/app/todo"
        onClick={() => {
          setActiveMenu({ name: "Todo" });
          if (width <= 1266) setShowMenu(false);
        }}
      >
        <Sun
          className={clsx(
            "w-4.5 h-4.5 stroke-muted-foreground",
            activeMenu.name === "Todo" && "stroke-form-foreground-accent",
          )}
        />
        <p className="text-foreground">{appDict("today")}</p>

        <span
          className={clsx(
            "mr-0 ml-auto px-2 py-0.5 rounded-full text-xs font-medium min-w-[24px] text-center truncate",
            activeMenu.name === "Todo"
              ? "text-muted-foreground"
              : "bg-border brightness-110",
          )}
        >
          {todayTodoCount}
        </span>
      </Link>
      </SidebarItem>

  );
};

export default TodoItem;
