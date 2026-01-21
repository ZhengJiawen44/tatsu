import clsx from "clsx";
import { CompletedTodoItemType } from "@/types";
import TodoCheckbox from "@/components/ui/TodoCheckbox";
import { X } from "lucide-react";
import { useUnCompleteTodo } from "../query/uncomplete-completedTodo";

export const CompletedTodoItemContainer = ({
  completedTodoItem,
}: {
  completedTodoItem: CompletedTodoItemType;
}) => {
  const { title, description } = completedTodoItem;
  const { mutateUnComplete } = useUnCompleteTodo();

  return (
    <>
      <div
        className={clsx(
          "w-full min-h-11 relative flex justify-between items-center my-4 bg-inherit py-2 rounded-md",
        )}
      >
        <div className="w-full">
          <div className="flex items-start gap-3">
            <TodoCheckbox
              icon={X}
              onChange={() => mutateUnComplete(completedTodoItem)}
              complete={true}
              checked={true}
              priority={completedTodoItem.priority}
            />
            <div className="w-full border">
              <p className="leading-none mb-1 text-sm md:text-md min-w-0">
                {title}
              </p>
              <pre className="text-muted-foreground text-sm flex whitespace-pre-wrap">
                {description}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
