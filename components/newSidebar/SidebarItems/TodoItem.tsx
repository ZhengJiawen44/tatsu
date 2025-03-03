import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";
import Pencil from "@/components/ui/icon/pencil";

const TodoItem = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  return (
    <Link
      href="/app/todo"
      className={clsx(
        "flex gap-1 items-center py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted",
        activeMenu.name === "Todo" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Todo" });
        localStorage.setItem("tab", JSON.stringify({ name: "Todo" }));
      }}
    >
      <Pencil className="w-5 h-5" />
      Todo
    </Link>
  );
};

export default TodoItem;
