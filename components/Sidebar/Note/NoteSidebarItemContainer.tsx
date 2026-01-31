import { useNote } from "@/features/notes/query/get-notes";
import React from "react";
import NoteLoading from "./NoteLoading";
import NoteSidebarItem from "./NoteSidebarItem";

export default function NoteSidebarItemContainer() {
  const { notes, isPending } = useNote();

  return (
    <div>
      {isPending ? (
        <NoteLoading />
      ) : (
        notes.map((note) => {
          return <NoteSidebarItem key={note.id} note={note} />;
        })
      )}
    </div>
  );
}
