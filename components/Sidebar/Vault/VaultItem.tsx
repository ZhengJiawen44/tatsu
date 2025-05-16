import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import Lock from "@/components/ui/icon/lock";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
const VaultItem = () => {
  const { width } = useWindowSize();

  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Link
      href="/app/vault"
      className={clsx(
        "py-2 px-6 w-full rounded-lg hover:cursor-pointer hover:bg-border-muted",
        activeMenu.name === "Vault" && "bg-border"
      )}
      onClick={() => {
        setActiveMenu({ name: "Vault" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <div className="flex gap-1 justify-start items-center w-full  select-none">
        <Lock className="w-5 h-5 " />
        Vault
      </div>
    </Link>
  );
};

export default VaultItem;
