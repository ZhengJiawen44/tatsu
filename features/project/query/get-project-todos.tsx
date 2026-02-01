import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";

export const useProject = ({ id }: { id: string }) => {
  const { toast } = useToast();
  //get Notes
  const {
    data: projectTodos = [],
    isLoading: projectTodosLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<TodoItemType[]>({
    queryKey: ["project", id],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const { projectTodos } = await api.GET({ url: `/api/project/${id}` });
      return projectTodos;
    },
  });

  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);
  return { projectTodos, projectTodosLoading, isFetching, isPending };
};

