import { CompletedTodoItemType } from "@/types";
import { format, isToday, isYesterday, isTomorrow, isThisWeek } from "date-fns";
import { useMemo } from "react";

function humanizeDate(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisWeek(date)) return format(date, "EEEE");

  return format(date, "MMM dd, yyyy");
}

export const useGroupedHistory = (completedTodos: CompletedTodoItemType[]) => {
  return useMemo(
    () =>
      completedTodos.reduce<Map<string, CompletedTodoItemType[]>>(
        (acc, curr) => {
          const label = humanizeDate(new Date(curr.completedAt));
          const relatedGroupArray = acc.get(label);

          if (relatedGroupArray) {
            acc.set(label, [...relatedGroupArray, curr]);
          } else {
            acc.set(label, [curr]);
          }

          return acc;
        },
        new Map(),
      ),
    [completedTodos],
  );
};
