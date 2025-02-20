import React from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "./AppInnerLayout";
import Tiptap from "./Note/Editor/Tiptap";
const Note = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={cn("", className)}>
      <Tiptap />
    </AppInnerLayout>
  );
};

export default Note;
