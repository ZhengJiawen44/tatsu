/*
 * uses Password-Based Key Derivation Function 2 (PBKDF2)
 * with 600,000 iteration rounds to stretch the user's passkey
 * with a salt of the user's email address.
 *
 * results in a 256-bit Master key
 */

interface DeriveMasterKeyProps {
  passkey: string;
  email: string;
  rounds?: number;
}

export async function deriveMasterKey({
  passkey,
  email,
  rounds = 600_000,
}: DeriveMasterKeyProps): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();

  // Convert passkey into a raw key
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passkey),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive 256-bit Master Key
  const masterKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      iterations: rounds || 600_000,
      salt: encoder.encode(email),
    },
    baseKey,
    256
  );
  return masterKey;
}
