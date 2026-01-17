import { CompletedTodoItemType } from "@/types";
import React from "react";
import { CompletedTodoItemContainer } from "./ItemContainer";
import LineSeparator from "@/components/ui/lineSeparator";
import { format } from "date-fns";

type GroupedCompletedTodoContainerProps = {
  dateTimeString: string;
  completedTodos: CompletedTodoItemType[];
};

export default function GroupedCompletedTodoContainer({
  dateTimeString,
  completedTodos,
}: GroupedCompletedTodoContainerProps) {
  return (
    <div>
      <h3 className="text-xl text-muted-foreground ">
        {dateTimeString}{" "}
        <span className="ml-4 text-sm text-muted-foreground">
          {format(completedTodos[0].completedAt, "dd MMM yyyy")}
        </span>
      </h3>
      <LineSeparator />
      <div>
        {completedTodos.map((todo) => {
          return (
            <CompletedTodoItemContainer
              key={todo.id}
              completedTodoItem={todo}
            />
          );
        })}
      </div>
    </div>
  );
}
