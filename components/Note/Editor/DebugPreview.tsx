import { useCurrentEditor, useEditor } from "@tiptap/react";
import React from "react";

const DebugPreview = () => {
  const { editor } = useCurrentEditor();
  return <div>{editor?.getJSON().text}</div>;
};

export default DebugPreview;
