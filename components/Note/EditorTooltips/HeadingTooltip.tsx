import React, { SetStateAction, useEffect, useRef, useState } from "react";

import { MenuItem } from "../EditorMenu/MenuItem";
import { Editor, useCurrentEditor } from "@tiptap/react";
import {
  Heading,
  Heading1,
  Heading2,
  Heading3,
} from "@/components/ui/icon/fonts";
const HeadingTooltip = ({ editor }: { editor: Editor }) => {
  const [showHeading, setShowHeading] = useState(false);
  const HeadingRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        HeadingRef.current &&
        !HeadingRef.current.contains(event.target as Node)
      ) {
        setShowHeading(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowHeading]);
  return (
    <div className="flex relative">
      <button
        title="Heading"
        className=" px-[0.6rem] rounded-md hover:bg- aspect-square"
        onClick={() => setShowHeading(!showHeading)}
      >
        <Heading className="w-4 h-4" />
      </button>
      {showHeading && (
        <MenuContents
          ref={HeadingRef}
          setShowHeading={setShowHeading}
          editor={editor}
        />
      )}
    </div>
  );
};

const MenuContents = ({
  ref,
  setShowHeading,
  editor,
}: {
  ref: React.RefObject<null | HTMLDivElement>;
  setShowHeading: React.Dispatch<SetStateAction<boolean>>;
  editor: Editor;
}) => {
  return (
    <div
      ref={ref}
      className="flex gap-1 border absolute top-12 left-0 p-1 rounded-lg bg-card justify-center items-center shadow-2xl"
    >
      <div>
        <MenuItem
          className="flex justify-center items-center"
          title="heading 1"
          isActive={() => {
            return editor!.isActive("heading", { level: 1 });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHeading({ level: 1 }).run();
            setShowHeading(false);
          }}
        >
          <Heading1 className="w-4 h-4" />
        </MenuItem>
      </div>
      <div>
        <MenuItem
          title="heading 2"
          className="flex justify-center items-center"
          isActive={() => {
            return editor!.isActive("heading", { level: 2 });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHeading({ level: 2 }).run();
            setShowHeading(false);
          }}
        >
          <Heading2 className="w-4 h-4" />
        </MenuItem>
      </div>
      <div>
        <MenuItem
          title="heading 3"
          className="flex justify-center items-center"
          isActive={() => {
            return editor!.isActive("heading", { level: 3 });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHeading({ level: 3 }).run();
            setShowHeading(false);
          }}
        >
          <Heading3 className="w-4 h-4" />
        </MenuItem>
      </div>
    </div>
  );
};
export default HeadingTooltip;
