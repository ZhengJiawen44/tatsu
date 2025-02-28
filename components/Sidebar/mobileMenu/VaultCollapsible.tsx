// not yet a collapsible
import clsx from "clsx";
import React from "react";
import { useMenu } from "@/providers/MenuProvider";
import { useStorage } from "@/hooks/useVault";

const VaultCollapsible = () => {
  const { activeMenu, setActiveMenu, setShowMobileSidebar } = useMenu();
  // get user's storage usage information
  const { data, isLoading } = useStorage();

  if (isLoading || !data) {
    return <p>loading...</p>;
  }
  const maxStorage = data.maxStorage;
  const usedStorage = data.usedStoraged;
  const percentage = ((usedStorage / maxStorage) * 100).toFixed(2);

  return (
    <div className="flex items-end leading-none gap-2">
      <button
        className={clsx(
          " w-fit hover:text-white ml-1",
          activeMenu === "Vault" && "text-white"
        )}
        onClick={() => {
          setActiveMenu("Vault");
          setShowMobileSidebar(false);
          localStorage.setItem("prevTab", "Vault");
        }}
      >
        Vault
      </button>
      <p className="text-[0.8rem]">{percentage}% used</p>
    </div>
  );
};

export default VaultCollapsible;
