import { useQueryClient } from "@tanstack/react-query";

export const useUserTimezone = () => {
  const queryClient = useQueryClient();
  const timeZone = queryClient.getQueryData<{ timeZone: string }>([
    "userTimezone",
  ]);
  return timeZone;
};
