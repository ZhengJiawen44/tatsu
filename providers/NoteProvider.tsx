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

interface NoteContextType {
  currentNote: NoteItemType | null;
  setCurrentNote: React.Dispatch<SetStateAction<NoteItemType | null>>;
  isLoading: boolean;
}

const NoteContext = createContext<null | NoteContextType>(null);

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentNote, setCurrentNote] = useState<NoteItemType | null>(null);
  //Get notes
  const { notes, notesLoading } = useNote();
  //create Notes
  const { createNote, createLoading } = useCreateNote({
    onSuccess: setCurrentNote,
  });

  useEffect(() => {
    if (!notesLoading && notes) {
      if (notes.length > 0) {
        // Get the latest note by createdAt
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
