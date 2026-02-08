import React from "react";
import OverDueTodoContainer from "@/features/overdueTodos/component/OverDueTodoContainer";
import TodayTodoContainer from "@/features/todayTodos/component/TodayTodoContainer";
const Page = async () => {


  return (
    <div className="select-none bg-inherit mt-4">
      <TodayTodoContainer />
      <OverDueTodoContainer />
    </div>
  );
};

export default Page;