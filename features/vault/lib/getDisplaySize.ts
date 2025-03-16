export function getDisplaySize(size: number) {
  if (size >= 1_000_000_000) {
    // GB
    return (size / 1_000_000_000).toFixed(0) + " GB";
  } else if (size >= 1_000_000) {
    // MB
    return (size / 1_000_000).toFixed(0) + " MB";
  } else if (size >= 1000) {
    // KB
    return (size / 1000).toFixed(0) + " KB";
  }
  return `${size} B`; // Bytes
}
