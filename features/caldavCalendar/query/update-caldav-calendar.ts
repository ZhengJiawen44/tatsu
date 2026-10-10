import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { CaldavCalendar } from "@/types";

async function patchCaldavCalendar({
  caldavCalendar,
}: {
  caldavCalendar: CaldavCalendar;
}) {
  if (!caldavCalendar.id) {
    throw new Error("this caldavCalendar is missing");
  }

  //this route only toggles selected property of the caldav calendar
  const res = await api.PATCH({
    url: `/api/calDav/calendar/${caldavCalendar.id}`,
    headers: { "Content-Type": "application/json" },
  });
  return res.data as CaldavCalendar[];
}

export const useEditCaldavCalendar = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editCaldavCalendarMutateFn,
    status: editCaldavCalendarStatus,
  } = useMutation({
    mutationFn: (params: CaldavCalendar) =>
      patchCaldavCalendar({ caldavCalendar: params }),
    onMutate: async (newCaldavCalendar) => {
      await queryClient.cancelQueries({ queryKey: ["caldavCalendar"] });
      const oldCaldavCalendars = queryClient.getQueryData<CaldavCalendar[]>([
        "caldavCalendar",
      ]);

      queryClient.setQueryData(
        ["caldavCalendar"],
        (oldCaldavCalendars: CaldavCalendar[]) =>
          oldCaldavCalendars.map((oldCaldavCalendar) => {
            if (oldCaldavCalendar.id !== newCaldavCalendar.id) {
              return { ...oldCaldavCalendar, selected: false };
            }
            return { ...newCaldavCalendar, selected: true };
          }),
      );

      return { oldCaldavCalendars };
    },
    onSettled: () => {
      toast({ description: "selected calendar succesfully changed" });
      queryClient.invalidateQueries({ queryKey: ["caldavCalendar"] });
    },
    onError: (error, newCaldavCalendar, context) => {
      queryClient.setQueryData(["caldavCalendar"], context?.oldCaldavCalendars);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editCaldavCalendarMutateFn, editCaldavCalendarStatus };
};
