import clsx from "clsx";
import { CompletedTodoItemType } from "@/types";
import TodoCheckbox from "@/components/ui/TodoCheckbox";
import { GoX } from "react-icons/go";
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
          "touch-none w-full min-h-11 relative flex justify-between items-center my-4 bg-inherit py-2 rounded-md",
        )}
      >
        <div className="w-full">
          <div className="flex items-start gap-3">
            <TodoCheckbox
              icon={GoX}
              onChange={() => mutateUnComplete(completedTodoItem)}
              complete={true}
              checked={true}
              priority={completedTodoItem.priority}
            />
            <div className="w-full">
              <p className="leading-none select-none mb-1 text-lg">{title}</p>
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
