import React, { useState } from "react";
import DecryptForm from "./EncryptionForm/decryptVaultForm";
import SearchBar from "@/components/ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useVault } from "../api/get-vault";
import PasskeyForm from "./EncryptionForm/passkeySetupForm";
import { useSession } from "next-auth/react";
import { usePassKey } from "@/providers/PassKeyProvider";

const Vault = () => {
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
    return <PasskeyForm email={email} />;

  // users who have encryption enabled need to present their passKey
  if (!passKey && enableEncryption) {
    return <DecryptForm email={email} />;
  }

  return (
    <>
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
    </>
  );
};

export default Vault;

{
}
