import React, { SetStateAction, useEffect, useRef, useState } from "react";

import { EditorToggle } from "./EditorToggle";
import { useCurrentEditor } from "@tiptap/react";
import {
  Heading,
  Heading1,
  Heading2,
  Heading3,
} from "@/components/ui/icon/fonts";

const HeadingTooltip = () => {
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
        <MenuContents ref={HeadingRef} setShowHeading={setShowHeading} />
      )}
    </div>
  );
};

const MenuContents = ({
  ref,
  setShowHeading,
}: {
  ref: React.RefObject<null | HTMLDivElement>;
  setShowHeading: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { editor } = useCurrentEditor();
  return (
    <div
      ref={ref}
      className="border absolute top-12 right-1/2 translate-x-1/2 p-1 rounded-lg bg-card"
    >
      <div>
        <EditorToggle
          className=""
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
        </EditorToggle>
      </div>
      <div>
        <EditorToggle
          title="heading 2"
          className=""
          isActive={() => {
            return editor!.isActive("heading", { level: 2 });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHeading({ level: 2 }).run();
            setShowHeading(false);
          }}
        >
          <Heading2 className="w-4 h-4" />
        </EditorToggle>
      </div>
      <div>
        <EditorToggle
          title="heading 3"
          className=""
          isActive={() => {
            return editor!.isActive("heading", { level: 3 });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHeading({ level: 3 }).run();
            setShowHeading(false);
          }}
        >
          <Heading3 className="w-4 h-4" />
        </EditorToggle>
      </div>
    </div>
  );
};
export default HeadingTooltip;
