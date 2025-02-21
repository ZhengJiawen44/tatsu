import React, { SetStateAction, useEffect, useRef } from "react";
import { MenuItem } from "../EditorMenu/MenuItem";
import { Editor } from "@tiptap/react";
import LineSeparator from "@/components/ui/lineSeparator";

const ColorTooltip = ({
  setColorTooltip,
  editor,
}: {
  setColorTooltip: React.Dispatch<SetStateAction<boolean>>;
  editor: Editor;
}) => {
  const colorPickerRef = useRef<null | HTMLDivElement>(null);
  const TextColors = [
    "#a2a3b4",
    "#FF6B6B",
    "#FFC107",
    "#9C27B0",
    "#FF9800",
    "#03A9F4",
    "#E91E63",
    "#8BC34A",
    "#673AB7",
  ];
  const HighlightColors = ["#03A9F4", "#E91E63", "#8BC34A", "#673AB7"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setColorTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setColorTooltip]);

  const currentHighlight = editor?.getAttributes("highlight");
  const currentOpacity = currentHighlight?.bgOpacity ?? 1;
  return (
    <div
      ref={colorPickerRef}
      className="absolute bg-card shadow-2xl border w-40 h-fit  top-20 right-1/2 translate-x-1/2  rounded-lg p-1 py-2"
    >
      <p className="text-[0.85rem] my-2">Text</p>
      <LineSeparator className="my-2" />
      <p className="text-[0.8rem] mb-2">color</p>
      <div className="relative w-full h-6 rounded-md overflow-hidden">
        <input
          onChange={(e) =>
            editor!.chain().focus().setColor(e.currentTarget.value).run()
          }
          type="color"
          className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 outline-none bg-transparent p-0"
          defaultValue={"#03A9F4"}
        />
      </div>
      <LineSeparator className="my-2" />
      <div className="grid grid-cols-5 ">
        <UnsetText editor={editor!} />
        {TextColors.map((color, index) => (
          <MenuItem
            title={color}
            className="w-fit h-fit p-1"
            key={index}
            isActive={() => {
              return editor!.isActive("textStyle", { color: color });
            }}
            onClick={() => {
              editor!.chain().focus().setColor(color).run();
            }}
          >
            <div
              className="w-5 h-5 rounded cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </MenuItem>
        ))}
      </div>
      <LineSeparator className="my-2" />
      <p className="text-[0.85rem] mb-2">Highlight</p>
      <LineSeparator className="my-2" />
      <p className="text-[0.8rem] mb-2">color</p>
      <UnsetHighlight editor={editor!} />
      {HighlightColors.map((color, index) => (
        <MenuItem
          title={color}
          className="w-fit h-fit p-1"
          key={index + 120}
          isActive={() => {
            return editor!.isActive("highlight", { color: color });
          }}
          onClick={() => {
            editor!.chain().focus().toggleHighlight({ color: color }).run();
          }}
        >
          <div
            className="w-5 h-5 rounded cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </MenuItem>
      ))}

      <p className="text-[0.8rem] mb-2">opacity</p>
      <input
        defaultValue={currentOpacity}
        type="range"
        min={0}
        max={1}
        step={0.1}
        className="w-full border"
        onChange={(e) => {
          e.preventDefault();

          updateOpacity(editor!, +e.currentTarget.value);
          console.log("moved");
        }}
      />
    </div>
  );
};
const updateOpacity = (editor: Editor, newOpacity: number) => {
  const previousAttributes = editor.getAttributes("highlight");
  const existingColor = previousAttributes.color || "yellow"; // Default to yellow if no color is set

  editor
    .chain()
    .setMark("highlight", { color: existingColor, bgOpacity: newOpacity })
    .run();
};
const UnsetHighlight = ({ editor }: { editor: Editor }) => {
  return (
    <MenuItem
      title="remove highlight"
      className="w-fit h-fit p-1"
      isActive={() => {
        return false;
      }}
      onClick={() => {
        editor!.chain().focus().unsetHighlight().run();
      }}
    >
      <div className="w-5 h-5 outline outline-[2px] outline-border   rounded cursor-pointer " />
    </MenuItem>
  );
};
const UnsetText = ({ editor }: { editor: Editor }) => {
  return (
    <MenuItem
      title="reset color"
      className="w-fit h-fit p-1"
      isActive={() => {
        return false;
      }}
      onClick={() => {
        editor!.chain().focus().unsetColor().run();
      }}
    >
      <div className="w-5 h-5 outline outline-[2px] outline-border   rounded cursor-pointer " />
    </MenuItem>
  );
};

export default ColorTooltip;
