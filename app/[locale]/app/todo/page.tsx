
import React from "react";
import TodayTodoContainer from "@/features/todayTodos/component/TodayTodoContainer";
import OverDueTodoContainer from "@/features/overdueTodos/component/OverDueTodoContainer";
const Page = () => {
  return <div className="select-none bg-inherit mt-4">
    <TodayTodoContainer />
    <OverDueTodoContainer />
  </div>
};

export default Page;
