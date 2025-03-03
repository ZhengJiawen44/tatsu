import clsx from "clsx";
import React from "react";
import OK from "@/components/ui/icon/ok";
import { useMenu } from "@/providers/MenuProvider";
import Link from "next/link";

const CompletedItem = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  return (
    <Link
      href="/app/completed"
      className={clsx(
        "flex items-center py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted gap-1",
        activeMenu.name === "Completed" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Completed" });
      }}
    >
      <OK className="w-5 h-5" />
      Completed
    </Link>
  );
};

export default CompletedItem;
