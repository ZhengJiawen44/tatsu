export async function renameNote({
  id,
  name,
  toast,
}: {
  id: string;
  name: string;
  toast: (options: { description: string }) => void;
}) {
  try {
    if (!id) {
      toast({ description: "this Note is missing" });
      return;
    }
    //final line of defense
    if (name.trim().length <= 0) {
      toast({ description: "note name cannot be empty" });
      return;
    }
    const res = await fetch(`/api/note/${id}?rename=${name}`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok)
      throw new Error(
        data.message || `error ${res.status}: failed to rename note`
      );

    //its all quiet now
    // const { message } = data;
    // toast({ description: message });
  } catch (error) {
    toast({
      description:
        error instanceof Error ? error.message : "an unknown error occured",
    });
  }
}
