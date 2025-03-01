export async function hash(password: string, salt: string) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const saltedPasswordBuffer = new Uint8Array(
    saltBuffer.byteLength + passwordBuffer.byteLength
  );
  saltedPasswordBuffer.set(saltBuffer, 0);
  saltedPasswordBuffer.set(passwordBuffer, saltBuffer.byteLength);

  const hash = await crypto.subtle.digest(
    { name: "SHA-256" },
    saltedPasswordBuffer
  );
  // const decodedHash = //convert the hash to string
}
