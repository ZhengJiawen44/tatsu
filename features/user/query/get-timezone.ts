import { useQueryClient } from "@tanstack/react-query";

export const useUserTimezone = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<{ timeZone: string }>(["userTimezone"]);
  return data?.timeZone;
};
