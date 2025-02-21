import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import ColorTooltip from "../EditorTooltips/ColorTooltip";
import { MenuItem } from "./MenuItem";

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
} from "@/components/ui/icon/fonts";
import HeadingTooltip from "../EditorTooltips/HeadingTooltip";

const CustomMenu = ({ editor }: { editor: Editor | null }) => {
  const [colorTooltip, setColorTooltip] = useState(false);

  if (!editor) return null;
  return (
    <>
      <HeadingTooltip editor={editor} />
      <MenuItem
        title="bold"
        isActive={() => {
          return editor.isActive("bold");
        }}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="italic"
        isActive={() => {
          return editor.isActive("italic");
        }}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="underline"
        isActive={() => {
          return editor.isActive("underline");
        }}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="strike through"
        isActive={() => {
          return editor.isActive("strike");
        }}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="hyperlink"
        isActive={() => {
          return editor.isActive("link");
        }}
        onClick={() => setLink(editor)}
      >
        <HyperLink className="w-4 h-4" />
      </MenuItem>

      <div className="flex relative">
        <MenuItem
          title="color"
          className=""
          isActive={() => {
            return editor.isActive("color");
          }}
          onClick={() => setColorTooltip(!colorTooltip)}
        >
          <A className="w-4 h-4" />
        </MenuItem>
        {colorTooltip && (
          <ColorTooltip setColorTooltip={setColorTooltip} editor={editor} />
        )}
      </div>
      <MenuItem
        title="line separator"
        isActive={() => {
          return editor.isActive("horizontalRule");
        }}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Rule className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="bullet list"
        isActive={() => {
          return editor.isActive("bulletList");
        }}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <DottedList className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="numbered list"
        isActive={() => {
          return editor.isActive("orderedList");
        }}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <NumbereredList className="w-4 h-4" />
      </MenuItem>
      <MenuItem
        title="task list"
        isActive={() => {
          return editor.isActive("taskList");
        }}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <Checkbox className="w-4 h-4" />
      </MenuItem>
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

export default CustomMenu;
