import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function useStorage() {
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/user`);
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message); // Throw an error instead of handling it inside queryFn
      }
      return body.queriedUser;
    },
    queryKey: ["storageMetric"],
  });
  if (isError) {
    toast({ description: error.message });
  }

  return { data, isLoading };
}
