import React from "react";
import { EditorProvider, FloatingMenu, BubbleMenu } from "@tiptap/react";
import starterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TextStyle } from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import CustomBubbleMenu from "./CustomBubbleMenu";
import { CustomHighlight } from "./customHighlight";

const Tiptap = () => {
  return (
    <EditorProvider
      onUpdate={({ editor }) => console.log(editor.getHTML())}
      extensions={[
        starterKit,
        Underline,
        Color,
        TaskItem.configure({
          nested: true,

          HTMLAttributes: { class: "flex justify-start items-center gap-2" },
        }),
        TaskList,
        BulletList.configure({
          HTMLAttributes: { class: "list-disc pl-[3rem] leading-loose" },
        }),
        OrderedList.configure({
          HTMLAttributes: { class: "list-decimal pl-[3rem] leading-loose" },
        }),
        HorizontalRule.configure({ HTMLAttributes: { class: "my-4" } }),
        TextStyle.configure({}),
        CustomHighlight.configure({ multicolor: true }),

        Link.configure({
          HTMLAttributes: {
            class:
              "text-blue-600 hover:text-blue-800 underline decoration-1 hover:decoration-2 hover:cursor-pointer",
          },
        }),
      ]}
      content={`<h1>new page</h1>`}
      editorContainerProps={{
        className: "",
      }}
      editorProps={{
        attributes: { class: "focus:outline-none focus:border-none" },
      }}
    >
      {/* <FloatingMenu editor={null}>floating menu</FloatingMenu> */}
      <BubbleMenu
        editor={null}
        className="w-fit flex gap-1 bg-card-accent justify-center items-center border rounded-lg p-1 leading-0 text-[1.05rem]"
      >
        <CustomBubbleMenu />
      </BubbleMenu>
    </EditorProvider>
  );
};

export default Tiptap;
