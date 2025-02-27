import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "./useErrorToast";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { FileItemType } from "@/types";
import { postVault } from "@/lib/vault/postVault";
import { deleteVault } from "@/lib/vault/deleteVault";
import { base64Decode } from "@/lib/encryption/base64Decode";

export const useVault = ({
  debouncedKeyword,
  enableEncryption,
  symKey,
}: {
  debouncedKeyword: string;
  enableEncryption?: boolean;
  symKey?: string;
}) => {
  //get files
  const {
    data: fileList = [],
    isLoading: fileListLoading,
    isError,
    error,
  } = useQuery<FileItemType[]>({
    queryKey: ["vault", debouncedKeyword],

    queryFn: async () => {
      const res = await fetch(`/api/vault?search=${debouncedKeyword}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Todos`
        );

      const { vault }: { vault: FileItemType[] } = data;
      if (!vault) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`
        );
      }

      //decrypt data if user enabled Encryption and has setup symmetric key
      if (symKey && enableEncryption === true) {
        const decryptedVault = await Promise.all(
          vault.map(async (file) => {
            //for each aws url, fetch the cipher and create a uint8Array copy
            const res = await fetch(file.url);
            const body = await res.blob();
            const encryptedFile = new Uint8Array(await body.arrayBuffer());

            //extract the <16_byte cipher_key_iv> <32_byte encrypted_cipher_key> <16_byte encrypted_file_iv> <x_byte encrypted_file>
            //from the cipher
            const cipherKeyIv = encryptedFile.slice(0, 16);
            const encCipherKey = encryptedFile.slice(16, 48);
            const encFileIv = encryptedFile.slice(48, 64);
            const encFile = encryptedFile.slice(64);

            //decode and crypto key the symKey
            const decodedSymKey = base64Decode(symKey);

            const decodedSymCryptoKey = await crypto.subtle.importKey(
              "raw",
              decodedSymKey,
              { name: "AES-GCM" },
              false,
              ["encrypt", "decrypt"]
            );

            //decrypt the cipher key
            const decryptedCipherKey = await crypto.subtle.decrypt(
              { name: "AES-GCM", iv: cipherKeyIv },
              decodedSymCryptoKey,
              encCipherKey
            );
            //crypto key the cipher key
            const cipherCryptoKey = await crypto.subtle.importKey(
              "raw",
              decryptedCipherKey,
              { name: "AES-GCM" },
              false,
              ["encrypt", "decrypt"]
            );

            //decrypt the file
            const decryptedFileBuffer = await crypto.subtle.decrypt(
              { name: "AES-GCM", iv: encFileIv },
              cipherCryptoKey,
              encFile
            );

            //change file to the deoded file
            // Convert decrypted buffer into a Blob (assuming original file was binary)
            const decryptedFile = new File([decryptedFileBuffer], file.name);

            // Replace the original file in the vault
            return {
              ...file,
              url: URL.createObjectURL(decryptedFile), // Create a URL for download/viewing
            };
          })
        );
        return decryptedVault;
      }

      return vault as FileItemType[];
    },
    enabled:
      (enableEncryption === true && !!symKey) || enableEncryption === false,
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { fileList, fileListLoading };
};

//post file
export const useCreateFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createFile,
    isPending: createLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      file: File;
      symKey?: string;
      enableEncryption: boolean;
    }) => postVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createFile, createLoading, isSuccess };
};

//delete file
export const useDeleteFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutate,
    isPending: deletePending,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { deleteMutate, deletePending };
};
