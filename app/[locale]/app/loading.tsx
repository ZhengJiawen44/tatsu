import React from "react";
import Spinner from "@/components/ui/spinner";
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner className="w-16 h-16" />
    </div>
  );
};

export default Loading;
