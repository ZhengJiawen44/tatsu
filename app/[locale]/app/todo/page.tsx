
import React from "react";
import TodayTodoContainer from "@/features/todayTodos/component/TodayTodoContainer";
import Day from "@/components/todo/Day";
import OverDueTodoContainer from "@/features/overdueTodos/component/overDueTodoContainer";
const Page = () => {
  return <div className="select-none bg-inherit">
    <Day />

    <OverDueTodoContainer />
    <TodayTodoContainer />

  </div>
};

export default Page;
