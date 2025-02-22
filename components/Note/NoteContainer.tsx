import React, { useEffect } from "react";
import AppInnerLayout from "../AppInnerLayout";
import Editor from "./Editor";

const Note = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={className}>
      <Editor />
    </AppInnerLayout>
  );
};

export default Note;
