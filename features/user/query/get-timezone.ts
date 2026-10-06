import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

async function fetchUserTimezone() {
  const res = await api.GET({url: "/api/preferences"});
  return res.userTimezone;
}

export const useUserTimezone = () => {
  const { data: userTimezone, isLoading: userTimezoneLoading } = useQuery({
    queryKey: ["userTimezone"],
    queryFn: fetchUserTimezone,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  return {userTimezone, userTimezoneLoading}
};
