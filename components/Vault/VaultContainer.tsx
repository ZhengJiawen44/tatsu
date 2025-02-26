import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useVault } from "@/hooks/useVault";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import PasskeyForm from "./Encryption/PasskeyForm";
import { useSession } from "next-auth/react";

const Vault = ({ className }: { className?: string }) => {
  const { data: userData } = useSession();
  const email = userData?.user?.email;
  //searchBar controlled input
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 800);

  //track pending state for deleting file and uploading file
  const [isProcessing, setProcessing] = useState(false);

  //if debouncedKeyword is "", get all files. else get files with name like keyword. this is handled by the backend
  const { fileList, fileListLoading } = useVault(debouncedKeyword);

  // if encryptionEnabled and no symmetric key then initiate the passkey acquisition process
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/user`, { method: "GET" });
      const body = await res.json();
      if (!res.ok) {
        toast({ description: body.message });
        return;
      }
      const { enableEncryption, protectedSymmetricKey } = body.queriedUser;
      return { enableEncryption, protectedSymmetricKey };
    },
    queryKey: ["encryptionStatus"],
  });
  const queryClient = useQueryClient();
  const { mutate: enableEncMutate } = useMutation({
    mutationFn: async ({ enable }: { enable: boolean }) => {
      const res = await fetch(`/api/user?enableEncryption=${enable}`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encryptionStatus"] });
    },
  });

  if (isLoading || !email) {
    return <>loading...</>;
  }

  // register a passkey for first-time users
  if (!isLoading && data?.enableEncryption && !data.protectedSymmetricKey) {
    return <PasskeyForm className={className} email={email} />;
  } else {
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
  }
};

export default Vault;

{
}
