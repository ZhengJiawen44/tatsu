import React, { useEffect } from "react";
import AppInnerLayout from "../AppInnerLayout";
import Editor from "./Editor";
import { cn } from "@/lib/utils";

const Note = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={cn("relative", className)}>
      <Editor />
    </AppInnerLayout>
  );
};

export default Note;
