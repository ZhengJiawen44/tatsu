export async function patchNote({
  id,
  content,
  toast,
}: {
  id: string;
  content?: string;
  toast: (options: { description: string }) => void;
}) {
  if (!id) {
    toast({ description: "this Note is missing" });
    return;
  }

  const res = await fetch(`/api/note/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.message || `error ${res.status}: failed to edit Note`);

  // const { message } = data;
  // toast({ description: message });
}
