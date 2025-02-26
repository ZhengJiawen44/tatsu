/*
 * uses HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 *
 * results in a 512-bit Master key
 */
import { secureGenerator } from "./secureGenerator";

interface deriveStretchedMasterKeyProps {
  stretchedPassKey: CryptoKey;
}

export async function deriveStretchedMasterKey({
  stretchedPassKey,
}: deriveStretchedMasterKeyProps): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: secureGenerator(),
      info: encoder.encode("512 bits stretched master key"),
    },
    stretchedPassKey,
    512
  );

  return derivedKey;
}
