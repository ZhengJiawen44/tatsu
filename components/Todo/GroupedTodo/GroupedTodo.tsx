import { SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useSensor } from "@dnd-kit/core";
import { useSensors } from "@dnd-kit/core";
import { PointerSensor } from "@dnd-kit/core";
import { KeyboardSensor } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TodoItemType } from "@/types";
import { useEffect, useState } from "react";
import { TodoItem } from "../TodoItem/TodoItemContainer";
import { useQueryClient } from "@tanstack/react-query";

const GroupedTodo = ({ todos }: { todos: TodoItemType[] }) => {
  const queryClient = useQueryClient();
  const [items, setItems] = useState(todos);

  //update local state
  useEffect(() => {
    setItems(todos);
  }, [todos]);

  //changes to local state will update database
  useEffect(() => {
    async function reorderTodo(
      body: Record<string, { id: string; order: number }[]>
    ) {
      const res = await fetch("/api/todo/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) queryClient.invalidateQueries({ queryKey: ["todo"] });
    }
    //find which todo order changed
    const changeTodo = [] as { id: string; order: number }[];

    items.forEach((todo, index) => {
      if (todo.id !== todos[index].id) {
        changeTodo.push({ id: todo.id, order: todos[index].order });
      }
    });
    if (changeTodo.length > 0) {
      reorderTodo({ changedTodos: changeTodo });
    }
  }, [todos, items, queryClient]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => {
          return item.id === active.id;
        });
        const newIndex = items.findIndex((item) => {
          return item.id === over.id;
        });

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <TodoItem key={item.id} todoItem={item} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default GroupedTodo;
