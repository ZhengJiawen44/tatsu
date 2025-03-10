import { todoSchema } from "@/schema";
import { DateRange } from "react-day-picker";
export async function postTodo({
  title,
  desc,
  priority,
  dateRange,
  toast,
}: {
  title: string;
  desc?: string;
  priority: "Low" | "Medium" | "High";
  dateRange: DateRange;

  toast: (options: { description: string }) => void;
}) {
  try {
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

    const res = await fetch("/api/todo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsedObj.data),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.message || `error ${res.status}: failed to create Todo`
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
