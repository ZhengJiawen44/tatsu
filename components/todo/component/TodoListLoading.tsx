import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
const TodoListLoading = () => {
  return (
    <div>
      <div className="flex flex-col gap-10 mt-12">
        <div>
          <Skeleton className="w-full h-6 mb-3" />
          <Skeleton className="w-1/4 h-6" />
        </div>
        <div>
          <Skeleton className="w-full h-6 mb-3" />
          <Skeleton className="w-2/3 h-6" />
        </div>
      </div>
    </div>
  );
};

export default TodoListLoading;
