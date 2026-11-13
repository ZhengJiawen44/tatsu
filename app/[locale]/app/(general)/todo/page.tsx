import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import OverDueTodoContainer from "@/features/overdueTodos/component/OverDueTodoContainer";
import TodayTodoContainer from "@/features/todayTodos/component/TodayTodoContainer";
import { getOverdueTodos } from "./actions";
import { getUserPreferences } from "../../actions";
import UpcomingTodoContainer from "@/features/upcomingTodos/component/UpcomingTodoContainer";
const Page = async () => {
  const userPreferences = await getUserPreferences();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["overdueTodo"],
    queryFn: getOverdueTodos,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="select-none bg-inherit mt-4">
        <TodayTodoContainer />
        {userPreferences?.showOverdue != false && <OverDueTodoContainer />}
        {userPreferences?.showUpcoming != false && <UpcomingTodoContainer />}

      </div>
    </HydrationBoundary>
  );
};

export default Page;
