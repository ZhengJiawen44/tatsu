import React, { useEffect, useState } from "react";
import Spinner from "../ui/spinner";
import {
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
} from "@tiptap/react";
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
import CustomMenu from "./EditorMenu/CustomMenu";
import { CustomHighlight } from "../../lib/customHighlight";
import { useCurrentNote } from "@/providers/NoteProvider";
import EditorLoading from "../ui/EditorLoading";
import { useEditNote } from "@/hooks/useNote";

const Editor = () => {
  const { currentNote, setCurrentNote, isLoading } = useCurrentNote();
  //save notes
  const { editNote, editLoading, isSuccess, isError } = useEditNote();
  const [showSaveStatus, setShowSaveStatus] = useState(false);
  useEffect(() => {
    if (isSuccess || isError) {
      setShowSaveStatus(true);
      const timer = setTimeout(() => setShowSaveStatus(false), 4000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isSuccess, isError]);

  const editor = useEditor({
    extensions: [
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
    ],
    onUpdate({ editor }) {
      setCurrentNote((prev) => {
        if (!prev) return prev;
        return { ...prev, content: editor.getHTML() };
      });
    },
    content: currentNote?.content || "<h1>new page</h1>",
    editorProps: {
      attributes: { class: "focus:outline-none focus:border-none" },
    },
  });

  //save editor contents on ctrl+s
  useEffect(() => {
    console.log("ctrl S");

    const saveOnEnter = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        event.stopPropagation();

        if (currentNote?.content)
          editNote({ id: currentNote!.id, content: currentNote?.content });
      }
    };
    document.addEventListener("keydown", saveOnEnter);

    //sync editor content with the useCurrentNote content
    if (editor && editor.getHTML() !== currentNote?.content) {
      if (currentNote?.content) {
        editor.commands.setContent(currentNote.content);
      } else {
        editor.commands.setContent("<h1>new page</h1>");
      }
    }
    return () => {
      document.removeEventListener("keydown", saveOnEnter);
    };
  }, [currentNote?.id, currentNote?.content]);

  if (!currentNote || isLoading) return <EditorLoading />;

  return (
    <>
      <div className="absolute top-2 right-5 flex gap-2 justify-center items-center">
        {editLoading ? (
          <>
            <Spinner className="w-4 h-4" />
            <p>Saving</p>
          </>
        ) : (
          ""
        )}
        {showSaveStatus &&
          (isSuccess ? (
            <p>Saved</p>
          ) : isError ? (
            <p className="text-red-500">Save failed</p>
          ) : (
            ""
          ))}
      </div>

      <FloatingMenu
        editor={editor}
        className="w-fit flex gap-1 justify-center items-center rounded-lg p-1 leading-0 text-[1.05rem]"
      >
        <CustomMenu editor={editor} />
      </FloatingMenu>
      <BubbleMenu
        editor={editor}
        className="w-fit flex gap-1 bg-card-accent justify-center items-center border rounded-lg p-1 leading-0 text-[1.05rem]"
      >
        <CustomMenu editor={editor} />
      </BubbleMenu>
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
