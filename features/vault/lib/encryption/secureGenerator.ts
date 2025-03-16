/*
 * Cryptographically Secure Pseudorandom Number Generator
 * used for generating initialization vector and keys
 */
export function secureGenerator(byteLength = 16): Uint8Array {
  const random = new Uint8Array(byteLength);
  crypto.getRandomValues(random); // Fills with secure random bytes
  return random;
}
