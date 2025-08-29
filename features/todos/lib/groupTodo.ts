import { TodoItemType } from "@/types";
import { getDisplayDate } from "@/lib/date/displayDate";
import { log } from "console";

export const groupTodo = ({ todos }: { todos: TodoItemType[] }) => {
  // console.log(todos);

  // Define the type for our accumulator
  type TodoAccumulator = {
    groupedPinnedTodos: Record<string, TodoItemType[]>;
    groupedUnPinnedTodos: Record<string, TodoItemType[]>;
  };

  // Process todos in one pass - filter, categorize, group by date, and sort
  const result = todos.reduce(
    (acc, todo) => {
      // Skip completed todos
      if (todo.completed) return acc;

      // Determine category key for the accumulator
      const category = todo.pinned
        ? "groupedPinnedTodos"
        : "groupedUnPinnedTodos";

      // Get date key
      const today = new Date();
      let dateKey;

      //is the todo valid for today?
      if (
        today.getTime() <= todo.expiresAt.getTime() &&
        todo.startedAt.getTime() < today.getTime()
      ) {
        dateKey = "today";
      } else {
        dateKey = getDisplayDate(todo.startedAt);
      }

      // Initialize nested objects if needed
      if (!acc[category][dateKey]) {
        acc[category][dateKey] = [];
      }
      acc[category][dateKey].push(todo);

      // Sort immediately after inserting (maintains sorted order with each insertion)
      acc[category][dateKey].sort((a, b) => a.order - b.order);

      return acc;
    },
    {
      groupedPinnedTodos: {} as Record<string, TodoItemType[]>,
      groupedUnPinnedTodos: {} as Record<string, TodoItemType[]>,
    } as TodoAccumulator
  );

  return {
    groupedPinnedTodos: result.groupedPinnedTodos,
    groupedUnPinnedTodos: result.groupedUnPinnedTodos,
  };
};

export const groupTodosByDate = (todos: TodoItemType[]) => {
  return todos.reduce((groups: Record<string, TodoItemType[]>, todo) => {
    if (!todo.completed) {
      // Only include uncompleted todos
      const dateKey = getDisplayDate(todo.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(todo);
    }
    return groups;
  }, {});
};
