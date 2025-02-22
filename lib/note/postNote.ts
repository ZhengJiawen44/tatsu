export async function postNote({
  name,
  content,
  toast,
}: {
  name: string;
  content?: string;
  toast: (options: { description: string }) => void;
}) {
  try {
    const res = await fetch("/api/note", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, content }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.message || `error ${res.status}: failed to create Note`
      );

    //quiet
    const { note } = data;
    return note;
    // toast({ description: message });
  } catch (error) {
    toast({
      description:
        error instanceof Error ? error.message : "an unknown error occured",
    });
  }
}
