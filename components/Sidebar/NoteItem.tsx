import React, { SetStateAction, useEffect, useRef, useState } from "react";
import File from "../ui/icon/file";
import { MeatballMenu, MenuItem } from "../MeatballMenu";
import { useCurrentNote } from "@/providers/NoteProvider";
import { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}
interface NoteItemProps {
  note: NoteItemType;
  renameNoteID: string | null;
  setRenameNoteID: React.Dispatch<SetStateAction<string | null>>;
}

const NoteItem = ({ note, renameNoteID, setRenameNoteID }: NoteItemProps) => {
  const queryClient = new QueryClient();
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const { currentNote, setCurrentNote, isLoading } = useCurrentNote();
  const [name, setName] = useState(note.name);

  //rename a note
  const { mutate: mutateRename, isPending: renamePending } = useMutation({
    mutationFn: renameNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      setRenameNoteID(null);
    },
  });
  // //paranoia
  async function renameNote() {
    const res = await fetch(`/api/note/${note.id}?rename=${name}`, {
      method: "PATCH",
    });
    const body = await res.json();
    console.log(body);
  }
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (name.trim().length > 0) {
          mutateRename();
        } else {
          setName(note.name);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const inputRef = nameInputRef.current;
      if (
        inputRef &&
        !inputRef.contains(event.target as Node) &&
        renameNoteID === note.id
      ) {
        setRenameNoteID(null);
        if (name.trim().length > 0) {
          mutateRename();
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
  });
  if (!currentNote || isLoading) {
    return <>Loading...</>;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setCurrentNote(note);
      }}
      className="hover:cursor-pointer hover:bg-border rounded-2xl w-full px-2 py-1 flex justify-between items-center gap-3 my-5"
    >
      <div className="flex gap-2">
        <File />

        <input
          placeholder="name cannot be empty"
          ref={nameInputRef}
          readOnly={renameNoteID !== note.id}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          type="text"
          value={name}
          className="bg-transparent outline-none hover:cursor-pointer placeholder:text-card-foreground-muted"
        />
      </div>

      <MeatballMenu>
        <MenuItem
          onClick={(e) => {
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
          onClick={(e) => {
            // e.stopPropagation();
          }}
        >
          delete
        </MenuItem>
      </MeatballMenu>
    </div>
  );
};

export default NoteItem;
