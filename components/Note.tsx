import React from "react";
import AppInnerLayout from "./AppInnerLayout";
import Tiptap from "./Note/Editor";

const Note = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={className}>
      <Tiptap />
    </AppInnerLayout>
  );
};

export default Note;
