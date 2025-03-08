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
import { TodoItemContainer } from "./TodoItem/TodoItemContainer";
import { useReorderTodo } from "@/hooks/useTodo";
import LineSeparator from "../ui/lineSeparator";

const TodoGroup = ({
  todos,
  showDay = false,
}: {
  todos: TodoItemType[];
  showDay?: boolean;
}) => {
  const { mutateReorder } = useReorderTodo();
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

  //changes to local state will update database
  useEffect(() => {
    const reorderList = reorderDiff();
    if (reorderList.length > 0) {
      const timer = setTimeout(
        () => mutateReorder({ body: { changedTodos: reorderList } }),
        3000
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [items]);

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
      {showDay && (
        <div className="flex items-center gap-2 mt-10">
          <h3 className="text-lg font-semibold select-none">Today</h3>
          <LineSeparator className="flex-1" />
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <TodoItemContainer key={item.id} todoItem={item} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default TodoGroup;
