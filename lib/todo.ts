import { todoSchema } from "@/schema";

export async function postTodo({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  //validate input
  const parsedObj = todoSchema.safeParse({ title, description: desc });

  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }

  const res = await fetch("/api/todo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });

  const body = await res.json();
  return body;
}

export async function patchTodo({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  //validate input
  const parsedObj = todoSchema.safeParse({ title, description });

  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }

  const res = await fetch(`/api/todo/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });

  const body = await res.json();
  return body;
}
