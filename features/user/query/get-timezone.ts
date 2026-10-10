import { api } from "@/lib/api-client";
import { userDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchUserTimezone() {
  const res = (await api.GET({ url: "/api/preferences" })) as userDetail;
  return res.userTimezone;
}

export const useUserTimezone = () => {
  const { data: userTimezone, isLoading: userTimezoneLoading } = useQuery({
    queryKey: ["userTimezone"],
    queryFn: fetchUserTimezone,
    retry: 2,
  });
  return { userTimezone, userTimezoneLoading };
};
