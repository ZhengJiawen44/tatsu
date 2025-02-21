import React, {
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoContent } from "@/lib/demoContent";
import { NoteItemType } from "@/types";

interface NoteContextType {
  currentNote: NoteItemType | null;
  setCurrentNote: React.Dispatch<SetStateAction<NoteItemType | null>>;
  isLoading: boolean;
}

const NoteContext = createContext<null | NoteContextType>(null);

const fetchNotes = async (): Promise<NoteItemType[]> => {
  const res = await fetch("/api/note");
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  const { notes } = await res.json();
  return notes;
};

const createDemoNote = async (): Promise<NoteItemType> => {
  const res = await fetch("/api/note", {
    method: "POST",
    body: JSON.stringify({ name: "Demo Note", content: demoContent }),
  });
  if (!res.ok) {
    throw new Error("Failed to create demo note");
  }
  const { note } = await res.json();
  return note;
};

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentNote, setCurrentNote] = useState<NoteItemType | null>(null);

  const queryClient = useQueryClient();

  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["note"],
    queryFn: fetchNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: createDemoNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      setCurrentNote(newNote);
    },
  });

  useEffect(() => {
    if (!isLoadingNotes && notes) {
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
        createNoteMutation.mutate();
      }
    }
  }, [isLoadingNotes]);

  return (
    <NoteContext.Provider
      value={{
        currentNote,
        setCurrentNote,
        isLoading: isLoadingNotes || createNoteMutation.isPending,
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
