import React from "react";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTodayTodos } from "./actions";
import OverDueTodoContainer from "@/features/overdueTodos/component/OverDueTodoContainer";
import TodayTodoContainer from "@/features/todayTodos/component/TodayTodoContainer";
const Page = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const todos = await getTodayTodos();
      const todoWithFormattedDates = todos.map((todo) => {
        const todoInstanceDate = todo.instanceDate
          ? new Date(todo.instanceDate)
          : null;
        const todoInstanceDateTime = todoInstanceDate?.getTime();
        const todoId = `${todo.id}:${todoInstanceDateTime}`;

        return {
          ...todo,
          id: todoId,
        };
      });

      return todoWithFormattedDates;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="select-none bg-inherit mt-4">
        <TodayTodoContainer />
        <OverDueTodoContainer />
      </div>
    </HydrationBoundary>
  );
};

export default Page;