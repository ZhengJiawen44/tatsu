import { CaldavCalendar } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const getCaldavCalendar = async () => {
  const data = await api.GET({
    url: `/api/calDav/calendar`,
  });
  const { caldavCalendars }: { caldavCalendars: CaldavCalendar[] } = data;

  if (!caldavCalendars) 
    throw new Error(
      data.message || `bad server response: Did not recieve caldavCalendars`,
    );
  
  return caldavCalendars;
};

export const useCaldavCalendar = () => {
  const { toast } = useToast();
  const {
    data: caldavCalendars = [],
    isLoading: caldavCalendarsLoading,
    isError,
    error,
  } = useQuery<CaldavCalendar[]>({
    queryKey: ["caldavCalendar"],
    retry: 2,
    queryFn: getCaldavCalendar,
  });
  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);

  return { caldavCalendars, caldavCalendarsLoading };
};
