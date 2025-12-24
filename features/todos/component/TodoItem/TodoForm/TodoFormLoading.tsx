import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
const TodoFormLoading = () => {
  return (
    <div className="w-full h-fit border rounded-md flex flex-col gap-4 p-4">
      <Skeleton className="w-1/4 h-6" />
      <div>
        <Skeleton className="w-2/3 h-4 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <Separator className="border" />
      <div className="flex justify-between -mt-2 w-full">
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 " />
          <Skeleton className="w-16 h-5 " />
          <Skeleton className="w-16 h-5 " />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 " />
          <Skeleton className="w-16 h-5 " />2
        </div>
      </div>
    </div>
  );
};

export default TodoFormLoading;
