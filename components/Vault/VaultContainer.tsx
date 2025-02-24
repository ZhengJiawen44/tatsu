import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultListItem";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FileItemType } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

const Vault = ({ className }: { className?: string }) => {
  const { toast } = useToast();

  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 800);
  //track loading state for forms
  const [isPending, setPending] = useState(false);

  //get all vault files, or if keyword is not empty, get the search result
  async function getVault() {
    const res = await fetch(`/api/vault?search=${keyword}`, { method: "GET" });
    const body = await res.json();
    if (!res.ok) toast({ description: body.message });
    return body.vault as FileItemType[];
  }
  const { data: fileList, isLoading: fileListLoading } = useQuery({
    queryFn: getVault,
    queryKey: ["vault", debouncedKeyword],
  });

  return (
    <AppInnerLayout className={cn("mt-20", className)}>
      <SearchBar
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.currentTarget.value)
        }
      />
      <VaultMenuContainer isPending={isPending} setPending={setPending} />
      <VaultListItem
        fileList={fileList ?? []}
        loading={fileListLoading}
        setPending={setPending}
      />
    </AppInnerLayout>
  );
};

export default Vault;
