"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompletedTodo } from "../query/get-completedTodo";
import { useGroupedHistory } from "../hooks/useGroupedHistory";
import GroupedCompletedTodoContainer from "./GroupedContainer";
import { useTranslations } from "next-intl";
const CompletedTodoContainer = () => {
  const completedDict = useTranslations("completed")
  const { completedTodos, todoLoading } = useCompletedTodo();
  const groupedHistory = useGroupedHistory(completedTodos);

  if (todoLoading)
    return (
      <>
        <Skeleton className="w-[20rem] h-[2rem]" />
        <br />
        <Skeleton className="w-[10rem] h-[1rem]" />
      </>
    );

  return (
    <>
      <h3 className="text-[1.2rem] sm:text-3xl"> {completedDict("title")}</h3>

      <div className="flex flex-col gap-10 my-12">
        {Array.from(groupedHistory.entries())
          .sort((a, b) => {
            const aDate = new Date(a[1][0].completedAt).getTime();
            const bDate = new Date(b[1][0].completedAt).getTime();

            return bDate - aDate;
          })
          .map(([dateTimeString, completeTodos]) => {
            return (
              <GroupedCompletedTodoContainer
                key={dateTimeString}
                dateTimeString={dateTimeString}
                completedTodos={completeTodos}
              />
            );
          })}
      </div>
    </>
  );
};

export default CompletedTodoContainer;
