export function concatUint8Array(...arrays: Uint8Array[]) {
  const length = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  arrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.byteLength;
  });
  return result;
}
