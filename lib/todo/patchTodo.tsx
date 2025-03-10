import { todoSchema } from "@/schema";
import { DateRange } from "react-day-picker";

export async function patchTodo({
  id,
  title,
  desc,
  priority,
  dateRange,
  toast,
}: {
  id: string;
  title: string;
  desc?: string;
  priority: "Low" | "Medium" | "High";
  dateRange: DateRange;
  toast: (options: { description: string }) => void;
}) {
  try {
    if (!id) {
      toast({ description: "this todo is missing" });
      return;
    }

    //validate input
    const parsedObj = todoSchema.safeParse({
      title,
      description: desc,
      priority,
      startedAt: dateRange.from,
      expiresAt: dateRange.to,
    });
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
