import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import LineSeparator from "@/components/ui/lineSeparator";
const VaultSidebarContainer = () => {
  const { toast } = useToast();
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data, isFetched, isLoading } = useQuery({
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
    <>
      <div className="mb-10">
        <h2 className="flex gap-2 items-center text-[1.4rem]">Vault</h2>
        <LineSeparator />
      </div>

      <div className="w-full h-8 rounded-full bg-border relative mb-4">
        <div
          style={{ width: `${percentage}%` }}
          className="left-0 top-0  h-8 rounded-full bg-lime absolute transition-all duration-500 ease-in-out shadow-[0_0_1px_#aaff00,0_0_2px_#aaff00,0_0_15px_#aaff00]"
        ></div>
      </div>

      <p>{`${getDisplaySize(usedStorage)} of ${getDisplaySize(
        maxStorage
      )} used`}</p>
    </>
  );

  function getDisplaySize(size: number) {
    if (size >= 1_073_741_824) {
      // GB
      return (size / 1_073_741_824).toFixed(0) + " GB";
    } else if (size >= 1_048_576) {
      // MB
      return (size / 1_048_576).toFixed(0) + " MB";
    } else if (size >= 1024) {
      // KB
      return (size / 1024).toFixed(0) + " KB";
    }
    return `${size} B`; // Bytes
  }
};

export default VaultSidebarContainer;
