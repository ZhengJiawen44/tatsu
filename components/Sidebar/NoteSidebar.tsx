import React from "react";
import LineSeparator from "@/components/ui/lineSeparator";
import Note from "@/components/ui/icon/note";
import File from "../ui/icon/file";
import Plus from "../ui/plus";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { useNote } from "@/providers/NoteProvider";

interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}

const NoteSidebar = ({ noteList }: { noteList: NoteItemType[] }) => {
  const queryClient = useQueryClient();
  const { note, setNote } = useNote();

  //create a new note
  const { mutate: mutateCreate, isPending: createPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify({ name: "new note" }),
      });
      const { note } = await res.json();
      setNote(note);
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
          <button
            type="button"
            onClick={() => {
              setNote(note);
            }}
            className="hover:bg-border rounded-2xl w-full px-2 py-1 flex justify-start items-center gap-3 my-5"
            key={note.id}
          >
            <File /> {note.name}
          </button>
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
