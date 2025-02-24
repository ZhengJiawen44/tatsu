export async function deleteVault({
  id,
  toast,
}: {
  id: string;
  toast: (options: { description: string }) => void;
}) {
  const res = await fetch(`/api/vault/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || `Failed to delete file with id ${id}`);
  }
}
