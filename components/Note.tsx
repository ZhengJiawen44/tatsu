import React from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "./AppInnerLayout";
import Tiptap from "./Note/Editor/Tiptap";
import { useNote } from "@/providers/NoteProvider";
const Note = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={className}>
      <Tiptap />
    </AppInnerLayout>
  );
};

export default Note;
