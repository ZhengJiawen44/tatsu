import React, { useState } from "react";
import LineSeparator from "@/components/ui/lineSeparator";
import Note from "@/components/ui/icon/note";
import Plus from "@/components/ui/icon/plus";
import Spinner from "@/components/ui/spinner";
import { useCurrentNote } from "@/providers/NoteProvider";
import NoteItem from "./NoteSidebarItem";
import { NoteItemType } from "@/types";
import { useCreateNote } from "@/hooks/useNote";

const NoteSidebar = ({ noteList }: { noteList: NoteItemType[] }) => {
  const [renameNoteID, setRenameNoteID] = useState<null | string>(null);
  const { currentNote, setCurrentNote, isLoading } = useCurrentNote();

  //create a new note
  const { createNote, createLoading } = useCreateNote({
    onSuccess: (newNote) => setCurrentNote(newNote),
  });

  if (!currentNote || isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <h2 className="flex gap-2 items-center text-[1.4rem]">
        Notes <Note className="w-7 h-7" />
      </h2>
      <LineSeparator />
      {noteList.map((note) => {
        return (
          <NoteItem
            key={note.id}
            note={note}
            renameNoteID={renameNoteID}
            setRenameNoteID={setRenameNoteID}
          />
        );
      })}
      <button
        onClick={() => createNote({ name: "new page" })}
        className="my-3 flex justify-start items-center gap-3 hover:bg-border rounded-2xl px-2 py-1"
      >
        {createLoading ? (
          <Spinner className="w-5 h-5 stroke-card-foreground" />
        ) : (
          <Plus className="w-5 h-5 stroke-card-foreground" />
        )}
        new note
      </button>
    </div>
  );
};

export default NoteSidebar;
