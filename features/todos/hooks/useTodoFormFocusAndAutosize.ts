import { useEffect, useRef } from "react";
import adjustHeight from "@/features/todos/lib/adjustTextareaHeight";

//adjust height of the todo description based on content size
export function useTodoFormFocusAndAutosize(displayForm: boolean) {
  const titleRef = useRef<null | HTMLInputElement>(null);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  useEffect(() => {
    adjustHeight(textareaRef);
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);
  return { titleRef, textareaRef };
}
