import React, { useEffect, useRef, useState } from "react";
import File from "@/components/ui/icon/file";
import { MeatballMenu, MenuItem } from "@/components/ui/MeatballMenu";
import { useCurrentNote } from "@/providers/NoteProvider";
import clsx from "clsx";
import { NoteItemType } from "@/types";
import { useRenameNote, useDeleteNote } from "@/hooks/useNote";
import { useEditNote } from "@/hooks/useNote";

interface NoteItemProps {
  note: NoteItemType;
  onClick?: () => void;
}

const NoteItem = ({ note, onClick }: NoteItemProps) => {
  // the current input ref (for focus and setEditable on rename)
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  // manipulate the current Note from sidebar
  const { currentNote, setCurrentNote, renameNoteID, setRenameNoteID } =
    useCurrentNote();
  // controlled input from note name
  const [name, setName] = useState(note.name);

  //rename a note
  const { renameMutate, isSuccess: renameSuccess } = useRenameNote();
  //delete a note
  const { deleteMutate } = useDeleteNote();
  //edit a note
  const { editNote } = useEditNote();

  //after rename clear the rename Note ID
  useEffect(() => {
    if (renameSuccess) {
      setRenameNoteID(null);
    }
  }, [renameSuccess]);

  //rename on enter and mouse press outside of input
  useEffect(() => {
    const inputRef = nameInputRef.current;
    if (!inputRef) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (name.trim().length > 0) {
          renameMutate({ id: note.id, name });
        } else {
          setName(note.name);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !inputRef.contains(event.target as Node) &&
        renameNoteID === note.id
      ) {
        setRenameNoteID(null);
        if (name.trim().length > 0) {
          renameMutate({ id: note.id, name });
        } else {
          setName(note.name);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [name, renameNoteID]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (currentNote) {
          editNote({ id: currentNote?.id, content: currentNote.content });
        }
        setCurrentNote(note);

        if (onClick) {
          onClick();
        }
      }}
      className={clsx(
        "hover:cursor-pointer xl:hover:bg-border rounded-md xl:rounded-2xl w-full px-2 py-1 flex justify-between items-center gap-3 my-1 xl:my-5",
        currentNote?.id === note.id && "bg-border"
      )}
    >
      <div
        className="w-full flex gap-2"
        onClick={() => localStorage.setItem("prevNote", note.id)}
      >
        <File />

        <div className="relative">
          <input
            onClick={(e) => {
              if (renameNoteID === note.id) {
                e.stopPropagation();
              }
            }}
            placeholder="name cannot be empty"
            ref={nameInputRef}
            readOnly={renameNoteID !== note.id}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            type="text"
            value={name}
            className="w-[10rem] sm:w-[15rem] md:w-[20rem] overflow-ellipsis text-[1rem] z-10 absolute bg-transparent outline-none hover:cursor-pointer placeholder:text-card-foreground-muted"
          />
        </div>
      </div>
      <MeatballMenu className="z-20">
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setRenameNoteID(note.id);

            const name = nameInputRef.current?.value;
            nameInputRef.current?.setSelectionRange(
              0,
              name?.length || 0,
              "forward"
            );
            nameInputRef.current?.focus();
          }}
        >
          rename
        </MenuItem>
        <MenuItem
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();

            deleteMutate({ id: note.id });
          }}
        >
          delete
        </MenuItem>
      </MeatballMenu>
    </div>
  );
};

export default NoteItem;
