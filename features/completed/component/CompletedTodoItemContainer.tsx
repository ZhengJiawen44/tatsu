import clsx from "clsx";
import { CompletedTodoItemType } from "@/types";
export const CompletedTodoItemContainer = ({
  completedTodoItem,
}: {
  completedTodoItem: CompletedTodoItemType;
}) => {
  const { title, description } = completedTodoItem;

  return (
    <>
      <div
        className={clsx(
          "touch-none w-full min-h-11 relative flex justify-between items-center my-4 bg-inherit py-2 rounded-md",
        )}
      >
        <div className="w-full">
          <div className="flex items-start gap-3">
            <div className="w-full">
              <p className="leading-none select-none text-card-foreground mb-1 text-sm">
                {title}
              </p>
              <pre className="text-card-foreground-muted text-sm flex whitespace-pre-wrap">
                {description}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

