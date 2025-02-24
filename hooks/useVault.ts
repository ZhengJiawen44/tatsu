import { TodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "./useErrorToast";
import { useMutation } from "@tanstack/react-query";
import { patchTodo } from "@/lib/todo/patchTodo";
import { useToast } from "./use-toast";
import { FileItemType } from "@/types";
import { postVault } from "@/lib/vault/postVault";
import { deleteVault } from "@/lib/vault/deleteVault";

export const useVault = (debouncedKeyword: string) => {
  //get files
  const {
    data: fileList = [],
    isLoading: fileListLoading,
    isError,
    error,
  } = useQuery<FileItemType[]>({
    queryKey: ["vault", debouncedKeyword],

    queryFn: async () => {
      const res = await fetch(`/api/vault?search=${debouncedKeyword}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Todos`
        );

      const { vault } = data;
      if (!vault) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`
        );
      }
      return vault as FileItemType[];
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { fileList, fileListLoading };
};

//post file
export const useCreateFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createFile,
    isPending: createLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { file: File }) => postVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createFile, createLoading, isSuccess };
};

//delete file
export const useDeleteFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutate,
    isPending: deletePending,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { deleteMutate, deletePending };
};
