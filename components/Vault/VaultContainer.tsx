import React from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultListItem";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FileItemType } from "@/types";
const Vault = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  async function getVault() {
    const res = await fetch("/api/vault", { method: "GET" });
    const body = await res.json();
    if (!res.ok) toast({ description: body.message });
    return body.vault as FileItemType[];
  }
  const { data: fileList, isLoading: fileListLoading } = useQuery({
    queryFn: getVault,
    queryKey: ["vault"],
  });

  return (
    <AppInnerLayout className={cn("mt-20", className)}>
      <SearchBar />
      <VaultMenuContainer />
      <VaultListItem fileList={fileList ?? []} loading={fileListLoading} />
    </AppInnerLayout>
  );
};

export default Vault;
