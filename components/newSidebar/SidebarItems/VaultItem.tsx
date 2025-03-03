import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import Lock from "@/components/ui/icon/lock";
const VaultItem = () => {
  const { activeMenu, setActiveMenu } = useMenu();
  return (
    <nav
      className={clsx(
        "py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted",
        activeMenu.name === "Vault" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Vault" });
      }}
    >
      <div className="flex gap-1 justify-start items-center w-full  select-none">
        <Lock className="w-5 h-5 " />
        Vault
      </div>
    </nav>
  );
};

export default VaultItem;
