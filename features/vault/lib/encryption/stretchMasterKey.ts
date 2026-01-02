/*
 * uses Password-Based Key Derivation Function 2 (PBKDF2)
 * with 600,000 iteration rounds to stretch the user's passkey
 * with a salt of the user's email address, subsequently followed by
 *
 * HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 * results in a 256-bit Master key
 */

import { derive128BitKey } from "./derive128BitKey";
import { derive256BitKey } from "./derive256BitKey";
interface derive256BitMasterKeyProps {
  passKey: string;
  email: string;
}

export async function stretchMasterKey({
  email,
  passKey,
}: derive256BitMasterKeyProps): Promise<CryptoKey> {
  // this is the first derivation using PBKDF2, result is 128 bit or 16 byte key in array buffer
  const masterKey128Bit = await derive128BitKey({
    passkey: passKey,
    email: email,
  });

  // convert the bits to crypto key for second derivation
  const masterCryptoKey128 = await crypto.subtle.importKey(
    "raw",
    masterKey128Bit,
    { name: "HKDF" },
    false,
    ["deriveKey", "deriveBits"]
  );
  // this is the second derivation using HKDF, result is 256 bit or 32 byte key in array buffer
  const masterKey256Bit = await derive256BitKey({
    stretchedPassKey: masterCryptoKey128,
    email,
  });

  //import the key from this stretched master key
  const masterCryptoKey256 = await crypto.subtle.importKey(
    "raw",
    masterKey256Bit,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  return masterCryptoKey256;
}
