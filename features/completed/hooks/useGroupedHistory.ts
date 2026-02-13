import { CompletedTodoItemType } from "@/types";
import { isToday, isYesterday, isTomorrow, isThisWeek } from "date-fns";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

export const useGroupedHistory = (completedTodos: CompletedTodoItemType[]) => {
  const locale = useLocale();
  const appDict = useTranslations("app");

  const humanizeDate = useMemo(() => {
    // Cache formatters for performance
    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "long",
    });
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    return (date: Date) => {
      if (isToday(date)) return appDict("today");
      if (isYesterday(date)) return appDict("yesterday");
      if (isTomorrow(date)) return appDict("tomorrow");
      if (isThisWeek(date)) return weekdayFormatter.format(date);
      return dateFormatter.format(date);
    };
  }, [locale, appDict]);

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
    [completedTodos, humanizeDate],
  );
};
