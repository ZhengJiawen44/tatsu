import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import { usePassKey } from "@/providers/PassKeyProvider";
import { LockIcon, LockOpenIcon } from "lucide-react";
const VaultItem = () => {
  const { width } = useWindowSize();
  const { passKey } = usePassKey();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Link
      href="/app/vault"
      className={clsx(
        "select-none flex gap-3 items-center justify-center py-3 px-3  w-full rounded-lg hover:cursor-pointer hover:bg-popover border border-transparent",
        activeMenu.name === "Vault" &&
          "bg-popover-accent shadow-md text-form-foreground-accent !border-border",
      )}
      onClick={() => {
        setActiveMenu({ name: "Vault" });
        if (width <= 766) setShowMenu(false);
      }}
    >
      <div className="flex gap-3 justify-start items-center w-full  select-none">
        {!passKey ? (
          <LockIcon
            className={clsx(
              "w-5 h-5 stroke-muted-foreground",
              activeMenu.name === "Vault" && "stroke-form-foreground-accent",
            )}
          />
        ) : (
          <LockOpenIcon
            className={clsx(
              "w-5 h-5 stroke-muted-foreground",
              activeMenu.name === "Vault" && "stroke-form-foreground-accent",
            )}
          />
        )}
        Vault
      </div>
    </Link>
  );
};

export default VaultItem;
