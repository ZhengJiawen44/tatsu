export function getDisplaySize(size: number) {
  if (size >= 1_073_741_824) {
    // GB
    return (size / 1_073_741_824).toFixed(0) + " GB";
  } else if (size >= 1_048_576) {
    // MB
    return (size / 1_048_576).toFixed(0) + " MB";
  } else if (size >= 1024) {
    // KB
    return (size / 1024).toFixed(0) + " KB";
  }
  return `${size} B`; // Bytes
}
