import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import VaultStorageBar from "./VaultStorageBar";

const VaultSidebarContainer = () => {
  const { toast } = useToast();
  const session = useSession();
  const userId = session.data?.user?.id;

  //get user's storage usage information
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (userId) {
        const res = await fetch(`/api/user/${userId}`, { method: "GET" });
        const body = await res.json();
        if (!res.ok) {
          toast({ description: body.message });
          return;
        }
        return body.queriedUser;
      }
    },
    queryKey: ["storageMetric"],
    enabled: !!userId,
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
