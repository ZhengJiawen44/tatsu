import { useErrorNotification } from "@/hooks/useErrorToast";
import { NoteItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useNote = (enabled?: boolean) => {
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
    queryFn: async () => {
      const res = await fetch(`/api/note`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Ntes`
        );
      const { notes } = data;
      if (!notes) {
        throw new Error(
          data.message || `bad server response: Did not recieve notes`
        );
      }
      return notes;
    },
    enabled: enabled || false,
  });

  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { notes, notesLoading, isFetching, isPending };
};
