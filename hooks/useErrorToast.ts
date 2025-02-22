import { useEffect } from "react";
import { useToast } from "./use-toast";

export function useErrorNotification(isError: boolean, description: string) {
  const { toast } = useToast();
  useEffect(() => {
    if (isError) {
      toast({ description });
    }
  }, [isError, description]);
}
