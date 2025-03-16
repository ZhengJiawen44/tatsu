/*
 *converts File to byte array
 */

export async function file2Byte(file: File) {
  const fileArray = await file.arrayBuffer();
  return fileArray;
}
