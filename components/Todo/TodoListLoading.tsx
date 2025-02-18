import React from "react";
import { Skeleton } from "../ui/skeleton";
const TodoListLoading = () => {
  return (
    <div>
      <div className="flex flex-col gap-10 mt-12">
        <div>
          <Skeleton className="w-1/2 h-6 mb-3" />
          <Skeleton className="w-1/4 h-6" />
        </div>

        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-2/4 h-6" />
        <Skeleton className="w-4/6 h-6" />
      </div>
    </div>
  );
};

export default TodoListLoading;
