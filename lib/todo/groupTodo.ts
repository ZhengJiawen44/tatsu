import { TodoItemType } from "@/types";
import { getDisplayDate } from "../date/displayDate";

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
