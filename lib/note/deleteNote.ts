export async function deleteNote({
  id,
  toast,
}: {
  id: string;
  toast: (options: { description: string }) => void;
}) {
  try {
    const res = await fetch(`/api/note/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok)
      throw new Error(
        data.message || `error ${res.status}: failed to delete Note`
      );

    //all quiet
    // const { message } = data;
    // toast({ description: message });
  } catch (error) {
    toast({
      description:
        error instanceof Error ? error.message : "an unknown error occured",
    });
  }
}
