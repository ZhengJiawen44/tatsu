import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base64Decode } from "../lib/encryption/base64Decode";
import { concatUint8Array } from "../lib/encryption/concatUint8Array";
import { secureGenerator } from "../lib/encryption/secureGenerator";
import { api } from "@/lib/api-client";
async function postVault({
  file,
  symKey,
  enableEncryption,
}: {
  file: File;
  symKey?: string;
  enableEncryption: boolean;
}) {
  if (!file) {
    throw new Error("the given file was not found");
  }
  const formData = new FormData();

  //**encrypt files on the client */
  if (enableEncryption === true) {
    const cipherKeyBit = secureGenerator(16);
    const byteFile = await file.arrayBuffer();
    const iv = secureGenerator(16);
    const cipherKey = await crypto.subtle.importKey(
      "raw",
      cipherKeyBit,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );

    //encrypt the file with the cipher key
    const encryptedByteFile = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cipherKey,
      byteFile
    );

    //encrypt cipher key with the symmetric key
    const decodedSymKey = base64Decode(symKey!);

    const cipherKeyIv = secureGenerator(16);
    const symCryptoKey = await crypto.subtle.importKey(
      "raw",
      decodedSymKey,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    const encryptedCipherKey = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: cipherKeyIv },
      symCryptoKey,
      cipherKeyBit
    );

    const cipherObj = concatUint8Array(
      cipherKeyIv,
      new Uint8Array(encryptedCipherKey),
      iv,
      new Uint8Array(encryptedByteFile)
    );

    //send the encrypted file with the unencrypted name
    const encryptedFile = new File([cipherObj], file.name);
    formData.append("file", encryptedFile);
  } else {
    //or send the plain file if user disabled encryption
    formData.append("file", file);
  }
  await api.POST({ url: "/api/vault", body: formData });
}

export const useCreateFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createFile,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      file: File;
      symKey?: string;
      enableEncryption: boolean;
    }) => postVault({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createFile, createLoading, isSuccess };
};
