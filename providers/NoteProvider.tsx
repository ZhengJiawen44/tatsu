import React, {
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { demoContent } from "@/lib/demoContent";
import { NoteItemType } from "@/types";
import { useNote, useCreateNote } from "@/hooks/useNote";

/*
 * This context provider aims to track the current note the user is on.
 *
 * the idea is simple. When user clicks on a note, it sets the "currentNote" state to that.
 *
 * subsequently, the richText Editor's content depends on the currentNote and thus will
 * be re-rendered to display the current note.
 *
 */

interface NoteContextType {
  currentNote: NoteItemType | null;
  setCurrentNote: React.Dispatch<SetStateAction<NoteItemType | null>>;
  isLoading: boolean;
  renameNoteID: string | null;
  setRenameNoteID: React.Dispatch<SetStateAction<string | null>>;
  notes: NoteItemType[];
}

const NoteContext = createContext<null | NoteContextType>(null);

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentNote, setCurrentNote] = useState<NoteItemType | null>(null);
  //Get notes
  const { notes, notesLoading } = useNote(true);
  //create Notes
  const { createNote, createLoading } = useCreateNote({
    onSuccess: setCurrentNote,
  });
  //rename notes
  const [renameNoteID, setRenameNoteID] = useState<null | string>(null);

  useEffect(() => {
    if (!notesLoading && notes) {
      if (notes.length > 0) {
        //get the last opened note if any
        const lastOpenedId = localStorage.getItem("prevNote");
        if (lastOpenedId) {
          const note = notes.find((note) => note.id === lastOpenedId);

          if (note) {
            setCurrentNote(note);
            return;
          }
        }

        // else Get the latest note by createdAt
        const latestNote = notes.reduce((latest, current) => {
          const latestDate = new Date(latest.createdAt);
          const currentDate = new Date(current.createdAt);
          return currentDate > latestDate ? current : latest;
        }, notes[0]);
        setCurrentNote(latestNote);
      } else {
        // No notes exist, create initial note
        console.log("no notes, initializing starter note");
        createNote({ name: "Demo Note", content: demoContent });
      }
    }
  }, [notesLoading]);

  return (
    <NoteContext.Provider
      value={{
        currentNote,
        setCurrentNote,
        isLoading: notesLoading || createLoading,
        renameNoteID,
        setRenameNoteID,
        notes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useCurrentNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote must be used in NoteProvider");
  }
  return context;
};

export default NoteProvider;
