import { todoSchema } from "@/schema";

export async function patchTodo({
  id,
  title,
  desc,
  toast,
}: {
  id: string;
  title: string;
  desc?: string;
  toast: (options: { description: string }) => void;
}) {
  try {
    if (!id) {
      toast({ description: "this todo is missing" });
      return;
    }

    //validate input
    const parsedObj = todoSchema.safeParse({ title, description: desc });
    if (!parsedObj.success) {
      console.log(parsedObj.error.errors[0]);
      return;
    }
    const res = await fetch(`/api/todo/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsedObj.data),
    });
    const data = await res.json();

    if (!res.ok)
      throw new Error(
        data.message || `error ${res.status}: failed to edit Todo`
      );

    const { message } = data;
    toast({ description: message });
  } catch (error) {
    toast({
      description:
        error instanceof Error ? error.message : "an unknown error occured",
    });
  }
}
