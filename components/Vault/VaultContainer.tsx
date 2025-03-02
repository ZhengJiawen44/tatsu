import React, { useState } from "react";
import DecryptForm from "./EncryptionForm/decryptVaultForm";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useVault } from "@/hooks/useVault";

import PasskeyForm from "./EncryptionForm/passkeySetupForm";
import { useSession } from "next-auth/react";
import { usePassKey } from "@/providers/PassKeyProvider";

const Vault = ({
  className,
  inert,
}: {
  className?: string;
  inert: boolean;
}) => {
  const {
    symKey,
    passKey,
    protectedSymmetricKey,
    enableEncryption,
    passKeyLoading,
  } = usePassKey();

  const { data: userData } = useSession();
  const email = userData?.user?.email;
  //searchBar controlled input
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 800);

  //track pending state for deleting file and uploading file
  const [isProcessing, setProcessing] = useState(false);

  //if debouncedKeyword is "", get all files. else get files with name like keyword. this is handled by the backend
  const { fileList, fileListLoading } = useVault({
    debouncedKeyword,
    symKey,
    enableEncryption,
  });

  if (passKeyLoading || !email) {
    return <></>;
  }

  // register a passkey for first-time users
  if (!passKeyLoading && enableEncryption && !protectedSymmetricKey)
    return <PasskeyForm className={className} email={email} inert={inert} />;

  // users who have encryption enabled need to present their passKey
  if (!passKey && enableEncryption) {
    return <DecryptForm className={className} email={email} inert={inert} />;
  }

  return (
    <AppInnerLayout className={cn("mt-20", className)} inert={inert}>
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

{
}
