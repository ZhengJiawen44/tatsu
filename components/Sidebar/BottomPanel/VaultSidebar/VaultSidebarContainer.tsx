import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import VaultStorageBar from "./VaultStorageBar";

const VaultSidebarContainer = () => {
  const { toast } = useToast();

  //get user's storage usage information
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/user`, { method: "GET" });
      const body = await res.json();
      if (!res.ok) {
        toast({ description: body.message });
        return;
      }

      return body.queriedUser;
    },
    queryKey: ["storageMetric"],
  });

  if (isLoading || !data) {
    return <p>loading...</p>;
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
