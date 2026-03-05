import { calDavAccountType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const getCalDavAccount = async () => {
  const data = await api.GET({
    url: `/api/calDav/account`,
  });
  const { calDavAccount }: { calDavAccount: calDavAccountType } = data;
  return calDavAccount;
};

export const useCalDavAccount = () => {
  const { toast } = useToast();
  //get todos
  const {
    data: calDavAccount,
    isLoading: calDavAccountLoading,
    isError,
    error,
  } = useQuery<calDavAccountType>({
    queryKey: ["calDavAccount"],
    retry: 2,

    queryFn: getCalDavAccount,
  });
  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);

  return { calDavAccount, calDavAccountLoading };
};
