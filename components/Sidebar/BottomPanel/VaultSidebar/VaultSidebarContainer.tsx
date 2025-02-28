import React from "react";
import { useToast } from "@/hooks/use-toast";
import VaultStorageBar from "./VaultStorageBar";
import { useStorage } from "@/hooks/useVault";
const VaultSidebarContainer = () => {
  //get user's storage usage information
  const { data, isLoading } = useStorage();

  if (isLoading || !data) {
    return <></>;
  }
  const maxStorage = data.maxStorage;
  const usedStorage = data.usedStoraged;
  const percentage = ((usedStorage / maxStorage) * 100).toFixed(0);
  return (
    <VaultStorageBar
      maxStorage={maxStorage}
      usedStorage={usedStorage}
      percentage={percentage}
    />
  );
};

export default VaultSidebarContainer;
