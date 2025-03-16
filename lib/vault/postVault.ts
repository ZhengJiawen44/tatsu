import { secureGenerator } from "../../features/vault/lib/encryption/secureGenerator";
import { base64Decode } from "../../features/vault/lib/encryption/base64Decode";
import { concatUint8Array } from "../../features/vault/lib/encryption/concatUint8Array";
export async function postVault({
  file,
  symKey,
  enableEncryption,
  toast,
}: {
  file: File;
  symKey?: string;
  enableEncryption: boolean;
  toast: (options: { description: string }) => void;
}) {
  if (!file) {
    toast({ description: "the given file was not found" });
    return;
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

  const res = await fetch("/api/vault", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || `error ${res.status}: failed to create Todo`
    );
  const { message } = data;
  toast({ description: message });
}
