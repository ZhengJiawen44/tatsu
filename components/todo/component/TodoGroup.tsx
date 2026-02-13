import { SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useSensor } from "@dnd-kit/core";
import { useSensors } from "@dnd-kit/core";
import { KeyboardSensor, TouchSensor, MouseSensor } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TodoItemType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { TodoItemContainer } from "./TodoItemContainer";
import { useTodoMutation } from "@/providers/TodoMutationProvider";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { useToast } from "@/hooks/use-toast";

const TodoGroup = ({
  todos,
  className,
  overdue,
}: {
  todos: TodoItemType[];
  className?: string;
  overdue?: boolean;
}) => {
  const { toast } = useToast()
  const { preferences } = useUserPreferences();
  const { useReorderTodo } = useTodoMutation();
  const { reorderMutateFn } = useReorderTodo();
  const [items, setItems] = useState(todos);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update local state
  useEffect(() => {
    setItems(todos);
  }, [todos]);

  // Function to detect any changes between items and todos
  const reorderDiff = useCallback(() => {
    const reorderList = [] as { id: string; order: number }[];
    items.forEach((todo, index) => {
      if (todo.id !== todos[index].id) {
        reorderList.push({ id: todo.id, order: todos[index].order });
      }
    });
    return reorderList;
  }, [items, todos]);

  // Changes to local todo arrangement will update database
  useEffect(() => {
    // Wait for [items] to sync with [todos]
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
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
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

  if (!mounted || preferences?.sortBy) {
    return (
      <div className={className}>
        {items.map((item) => (
          <div
            key={item.id}
            draggable={true}
            onDragStart={(e) => {
              e.preventDefault();
              toast({ title: "Drag disabled; a global filter is active" })
            }}
          >
            <TodoItemContainer todoItem={item} overdue={overdue} />
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className={className}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <TodoItemContainer todoItem={item} key={item.id} overdue={overdue} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoGroup;