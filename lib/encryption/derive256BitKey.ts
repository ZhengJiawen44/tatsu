/*
 * uses HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 *
 * results in a 512-bit Master key
 */
interface deriveStretchedMasterKeyProps {
  stretchedPassKey: CryptoKey;
  email: string;
}

export async function derive256BitKey({
  stretchedPassKey,
  email,
}: deriveStretchedMasterKeyProps): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode(email),
      info: encoder.encode("512 bits stretched master key"),
    },
    stretchedPassKey,
    256
  );

  return derivedKey;
}
