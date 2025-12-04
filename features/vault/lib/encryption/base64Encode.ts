export const base64Encode = (target: ArrayBuffer | Uint8Array): string => {
  const uint8Array =
    target instanceof ArrayBuffer ? new Uint8Array(target) : target;

  const encodedTarget = btoa(String.fromCharCode(...uint8Array));
  return encodedTarget;
};

export default base64Encode;
