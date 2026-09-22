"use client";
import TodoGroup from "@/components/todo/component/TodoGroup";
import { usePinTodo } from "../query/pin-todo";
import { useCompletePinnedTodo } from "../query/complete-pinned-todo";
import { useDeletePinnedTodo } from "../query/delete-pinned-todo";
import { usePrioritizePinnedTodo } from "../query/prioritize-pinned-todo";
import { useEditPinnedTodo } from "../query/update-pinned-todo";
import { useEditPinnedTodoInstance } from "../query/update-pinned-todo-instance";
import { useReorderPinnedTodo } from "../query/reorder-pinned-todo";
import TodoMutationProvider from "@/providers/TodoMutationProvider";
import { usePinnedTodo } from "@/features/pinnedTodos/query/get-pinned-todo";

const PinnedTodoContainer = () => {

 const {pinnedTodos} = usePinnedTodo();

  return (
    <TodoMutationProvider
      useCompleteTodo={useCompletePinnedTodo}
      useDeleteTodo={useDeletePinnedTodo}
      useEditTodo={useEditPinnedTodo}
      useEditTodoInstance={useEditPinnedTodoInstance}
      usePinTodo={usePinTodo}
      usePrioritizeTodo={usePrioritizePinnedTodo}
      useReorderTodo={useReorderPinnedTodo}
    >
      <div className="mb-0">
        {/* Render Pinned Todos */}
        {pinnedTodos.length > 0 && (
          <TodoGroup
            className="relative my-10 rounded-md p-2 py-4 border border-border-muted bg-card shadow-md"
            todos={pinnedTodos}
          />
        )}
      </div>
    </TodoMutationProvider>
  );
};

export default PinnedTodoContainer;
