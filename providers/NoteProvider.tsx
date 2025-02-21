import React, {
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoContent } from "@/components/Note/demoContent";

interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}

interface noteContextType {
  note: NoteItemType | null;
  setNote: React.Dispatch<SetStateAction<NoteItemType | null>>;
  isLoading: boolean;
}

const NoteContext = createContext<null | noteContextType>(null);

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

export const NoteProvider = ({
  children,
  noteObj,
}: {
  children: React.ReactNode;
  noteObj?: NoteItemType;
}) => {
  const [note, setNote] = useState<NoteItemType | null>(noteObj || null);

  const queryClient = useQueryClient();

  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["note"],
    queryFn: fetchNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: createDemoNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      setNote(newNote);
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
        setNote(latestNote);
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
        note,
        setNote,
        isLoading: isLoadingNotes || createNoteMutation.isPending,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNote must be used in NoteProvider");
  }
  return context;
};

export default NoteProvider;
