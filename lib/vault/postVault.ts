export async function postVault({
  file,
  toast,
}: {
  file: File;
  toast: (options: { description: string }) => void;
}) {
  if (!file) {
    toast({ description: "the given file was not found" });
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/vault", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || `error ${res.status}: failed to create Todo`
    );
  const { message } = data;
  toast({ description: message });
}
