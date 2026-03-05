import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calDavAccountSchema } from "@/schema";
import { api } from "@/lib/api-client";
import { calDavAccountType } from "@/types";

async function upsertCalDavAccount(
  caldavAccount: Omit<calDavAccountType, "id">,
) {
  //validate input
  const parsedObj = calDavAccountSchema.safeParse({
    username: caldavAccount.username,
    password: caldavAccount.password,
    serverUrl: caldavAccount.serverUrl,
    service: caldavAccount.service,
  });

  if (!parsedObj.success) {
    throw new Error(parsedObj.error.errors[0].message);
  }

  const res = await api.POST({
    url: "/api/calDav/account",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });

  return res.account;
}

export const useUpsertCalDavAccount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutateAsync: upsertMutateAsyncFn,
    status: upsertStatus,
    error,
  } = useMutation({
    mutationFn: ({
      username,
      password,
      serverUrl,
      service,
    }: Omit<calDavAccountType, "id">) =>
      upsertCalDavAccount({ username, password, serverUrl, service }),
    //if fetch error then revert optimistic updates including form states
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calDavAccount"] });
    },
  });
  return { upsertMutateAsyncFn, upsertStatus, error };
};
