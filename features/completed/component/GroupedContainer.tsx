import { CompletedTodoItemType } from "@/types";
import React from "react";
import { CompletedTodoItemContainer } from "./ItemContainer";
import LineSeparator from "@/components/ui/lineSeparator";
import { useLocale } from "next-intl";

type GroupedCompletedTodoContainerProps = {
  dateTimeString: string;
  completedTodos: CompletedTodoItemType[];
};

export default function GroupedCompletedTodoContainer({
  dateTimeString,
  completedTodos,
}: GroupedCompletedTodoContainerProps) {
  const locale = useLocale();

  // Format date using Intl API for better performance and automatic locale support
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div>
      <h3 className="text-xl text-muted-foreground">
        {dateTimeString}{" "}
        <span className="ml-4 text-sm text-muted-foreground">
          {formatDate(completedTodos[0].completedAt)}
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
