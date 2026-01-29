import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
const VaultItem = () => {
  const sidebarDict = useTranslations("sidebar")

  const { width } = useWindowSize();
  const { activeMenu, setActiveMenu, setShowMenu } = useMenu();
  return (
    <Button
      asChild
      variant={"ghost"}
      className={clsx(
        "flex items-center border border-transparent font-normal",
        activeMenu.name === "Vault" &&
        "bg-sidebar-primary shadow-md text-form-foreground-accent !border-border",
      )}
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
              "w-5 h-5 stroke-muted-foreground",
              activeMenu.name === "Vault" && "stroke-form-foreground-accent",
            )}
          />

          <p className="text-foreground">{sidebarDict("vault")}</p>
        </div>
      </Link>
    </Button>
  );
};

export default VaultItem;
