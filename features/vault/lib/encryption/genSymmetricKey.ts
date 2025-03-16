/*
 * generated a 64 byte symmetric key and a 16 byte initial vector
 * encrypts the symmetric key and;
 * prepends the iv to the symmetric key
 * returns as finalArray
 *
 */
import { secureGenerator } from "./secureGenerator";

export async function genSymmetricKey(masterCryptoKey256: CryptoKey) {
  //this is the symmetric key
  const symmetricKey = secureGenerator(32);
  //this is the initial vector
  const iv = secureGenerator(16);

  //the protected symmetric key is 80 bytes 64 byte symmetric key+16 byte iv
  const protectedSymmetricKey = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    masterCryptoKey256,
    symmetricKey
  );

  const ivLength = iv.byteLength;
  const keyLength = protectedSymmetricKey.byteLength;
  const finalArray = new Uint8Array(ivLength + keyLength);
  finalArray.set(iv, 0);
  finalArray.set(new Uint8Array(protectedSymmetricKey), iv.byteLength);
  return [symmetricKey, finalArray];
}
