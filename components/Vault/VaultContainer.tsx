import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useVault } from "@/hooks/useVault";

const Vault = ({ className }: { className?: string }) => {
  //searchBar controlled input
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 800);

  //track pending state for deleting file and uploading file
  const [isProcessing, setProcessing] = useState(false);

  //if debouncedKeyword is "", get all files. else get files with name like keyword. this is handled by the backend
  const { fileList, fileListLoading } = useVault(debouncedKeyword);

  return (
    <AppInnerLayout className={cn("mt-20", className)}>
      <SearchBar
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.currentTarget.value)
        }
      />
      <VaultMenuContainer
        isProcessing={isProcessing}
        setProcessing={setProcessing}
      />
      <VaultListItem
        fileList={fileList ?? []}
        loading={fileListLoading}
        setProcessing={setProcessing}
      />
    </AppInnerLayout>
  );
};

export default Vault;
