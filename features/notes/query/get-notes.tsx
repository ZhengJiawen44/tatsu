import { NoteItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";

export const useNote = () => {
  const { toast } = useToast();
  //get Notes
  const {
    data: notes = [],
    isLoading: notesLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<NoteItemType[]>({
    queryKey: ["note"],
    retry: 2,
    queryFn: async () => {
      api.GET({ url: `/api/note` });
      const { notes } = await api.GET({ url: `/api/note` });
      return notes;
    },
  });

  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);
  return { notes, notesLoading, isFetching, isPending };
};
