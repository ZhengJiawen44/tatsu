import React, { useState } from "react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import ColorTooltip from "./ColorTooltip";
import { EditorToggle } from "./EditorToggle";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  HyperLink,
  A,
  Rule,
  DottedList,
  NumbereredList,
  Checkbox,
} from "../../ui/icon/fonts";
import HeadingTooltip from "./HeadingTooltip";

const CustomBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const [colorTooltip, setColorTooltip] = useState(false);

  if (!editor) return null;
  return (
    <>
      <HeadingTooltip />

      <EditorToggle
        title="bold"
        isActive={() => {
          return editor.isActive("bold");
        }}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="italic"
        isActive={() => {
          return editor.isActive("italic");
        }}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="underline"
        isActive={() => {
          return editor.isActive("underline");
        }}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="strike through"
        isActive={() => {
          return editor.isActive("strike");
        }}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="hyperlink"
        isActive={() => {
          return editor.isActive("link");
        }}
        onClick={() => setLink(editor)}
      >
        <HyperLink className="w-4 h-4" />
      </EditorToggle>

      <div className="flex relative">
        <EditorToggle
          title="color"
          className=""
          isActive={() => {
            return editor.isActive("color");
          }}
          onClick={() => setColorTooltip(!colorTooltip)}
        >
          <A className="w-4 h-4" />
        </EditorToggle>
        {colorTooltip && <ColorTooltip setColorTooltip={setColorTooltip} />}
      </div>
      <EditorToggle
        title="line separator"
        isActive={() => {
          return editor.isActive("horizontalRule");
        }}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Rule className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="bullet list"
        isActive={() => {
          return editor.isActive("bulletList");
        }}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <DottedList className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="numbered list"
        isActive={() => {
          return editor.isActive("orderedList");
        }}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <NumbereredList className="w-4 h-4" />
      </EditorToggle>
      <EditorToggle
        title="task list"
        isActive={() => {
          return editor.isActive("taskList");
        }}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <Checkbox className="w-4 h-4" />
      </EditorToggle>
    </>
  );
  function setLink(editor: Editor) {
    const url = prompt("enter your url:");
    if (url === null) {
      return;
    }
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }
    editor!.chain().extendMarkRange("bold").setLink({ href: url }).run();
  }
};

export default CustomBubbleMenu;
