import React from "react";
import AppInnerLayout from "../AppLayout";
import Editor from "./Editor";
import { cn } from "@/lib/utils";

const Note = ({ className, inert }: { className?: string; inert: boolean }) => {
  return (
    <AppInnerLayout className={cn("relative pt-20", className)} inert={inert}>
      <Editor />
    </AppInnerLayout>
  );
};

export default Note;
