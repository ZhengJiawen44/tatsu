import React, { useRef, useState } from "react";
import LineSeparator from "@/components/ui/lineSeparator";
import Note from "@/components/ui/icon/note";
import Plus from "../ui/plus";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { useCurrentNote } from "@/providers/NoteProvider";
import NoteItem from "./NoteItem";

interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}

const NoteSidebar = ({ noteList }: { noteList: NoteItemType[] }) => {
  const queryClient = useQueryClient();
  const [renameNoteID, setRenameNoteID] = useState<null | string>(null);
  const { currentNote, setCurrentNote } = useCurrentNote();

  //create a new note
  const { mutate: mutateCreate, isPending: createPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify({ name: "new note" }),
      });
      const { note } = await res.json();
      setCurrentNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

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
        onClick={() => mutateCreate()}
        className="my-3 flex justify-start items-center gap-3 hover:bg-border rounded-2xl px-2 py-1"
      >
        {createPending ? (
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
