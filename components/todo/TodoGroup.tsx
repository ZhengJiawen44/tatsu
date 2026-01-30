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
import { useCallback, useEffect, useState } from "react";
import { TodoItemContainer } from "./TodoItemContainer";
import { useTodoMutation } from "@/providers/TodoMutationProvider";

const TodoGroup = ({
  todos,
  className,
  overdue,
}: {
  todos: TodoItemType[];
  className?: string;
  overdue?: boolean
}) => {
  const { useReorderTodo } = useTodoMutation()
  const { reorderMutateFn } = useReorderTodo();
  const [items, setItems] = useState(todos);

  //update local state
  useEffect(() => {
    setItems(todos);
  }, [todos]);
  //function to detect any changes between items and todos. creates an array that describes how the new todos should be arranged
  const reorderDiff = useCallback(() => {
    const reorderList = [] as { id: string; order: number }[];
    items.forEach((todo, index) => {
      if (todo.id !== todos[index].id) {
        reorderList.push({ id: todo.id, order: todos[index].order });
      }
    });
    return reorderList;
  }, [items, todos]);

  //changes to local todo arrangement will update database
  useEffect(() => {
    //wait for [items] to sync with [todos]
    if (todos.length !== items.length) return;
    const reorderList = reorderDiff();
    if (reorderList.length > 0) {
      const timer = setTimeout(() => reorderMutateFn(reorderList), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [items, todos, reorderDiff, reorderMutateFn]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
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
    <div className={className}>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <TodoItemContainer todoItem={item} key={item.id} overdue={overdue} />
          ))}
        </SortableContext>
      </DndContext>


    </div>
  );
};

export default TodoGroup;
