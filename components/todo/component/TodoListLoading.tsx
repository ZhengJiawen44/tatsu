import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LineSeparator from "@/components/ui/lineSeparator";
const TodoListLoading = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 mt-12">
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-inherit  border-[5px] rounded-full" />
          <div className="w-full">
            <Skeleton className="w-28 h-6 mb-3" />
            <Skeleton className="w-1/4 h-6" />
          </div>
        </div>
        <LineSeparator className="m-0" />
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-inherit  border-[5px] rounded-full" />
          <div className="w-full">
            <Skeleton className="w-40 h-6 mb-3" />
            <Skeleton className="w-2/4 h-6" />
          </div>
        </div>
        <LineSeparator className="m-0" />
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-inherit  border-[5px] rounded-full" />
          <div className="w-full">
            <Skeleton className="w-36 h-6 mb-3" />
          </div>
        </div>
        <LineSeparator className="m-0" />
      </div>
    </div>
  );
};

export default TodoListLoading;
