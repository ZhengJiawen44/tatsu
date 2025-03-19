import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useEffect } from "react";

export function useStorage() {
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { queriedUser } = await api.GET({ url: "/api/user" });
      return queriedUser;
    },
    queryKey: ["storageMetric"],
    retry: 2,
  });
  useEffect(() => {
    if (isError) {
      toast({ description: error.message });
    }
  }, [isError]);

  return { data, isLoading };
}
