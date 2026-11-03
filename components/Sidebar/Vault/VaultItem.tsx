import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

import useWindowSize from "@/hooks/useWindowSize";
import { LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SidebarItem from "../SidebarItem";
const VaultItem = () => {
  const sidebarDict = useTranslations("sidebar");

  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <SidebarItem
      asChild
      className={activeMenu.name === "Vault" ? "bg-sidebar-primary" : ""}
    >
      <Link
        href="/app/vault"
        onClick={() => {
          setActiveMenu({ name: "Vault" });
          if (width <= 766) setShowMenu(false);
        }}
      >
        <div className="flex gap-3 justify-start items-center w-full  select-none">
          <LockIcon
            className={clsx(
              "w-4.5 h-4.5 stroke-muted-foreground",
              activeMenu.name === "Vault" && "stroke-form-foreground-accent",
            )}
          />

          <p className="text-foreground">{sidebarDict("vault")}</p>
        </div>
      </Link>
    </SidebarItem>
  );
};

export default VaultItem;
