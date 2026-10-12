import React from "react";
import Spinner from "@/components/ui/spinner";
const Loading = () => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60">
      <Spinner className="h-16 w-16 text-foreground" />
    </div>
  );
};

export default Loading;
