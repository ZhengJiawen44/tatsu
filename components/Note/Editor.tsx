import React, { useEffect } from "react";
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
import EditorLoading from "../Loading/EditorLoading";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

const Editor = () => {
  const queryClient = useQueryClient();
  const { currentNote, setCurrentNote, isLoading } = useCurrentNote();
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

  //create notes
  const saveNote = async () => {
    const res = await fetch(`/api/note/${currentNote!.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        content: currentNote!.content,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create demo note");
    }
    const { note } = await res.json();
    return note;
  };

  const saveNoteMutation = useMutation({
    mutationFn: saveNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      // setCurrentNote(newNote);
    },
  });

  useEffect(() => {
    //save editor contents on ctrl+s
    const saveOnEnter = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        event.stopPropagation();
        saveNoteMutation.mutate();
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
  }, [currentNote?.id]);

  if (!currentNote || isLoading) return <EditorLoading />;
  return (
    <>
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
