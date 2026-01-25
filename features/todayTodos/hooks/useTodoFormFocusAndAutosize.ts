import { useEffect, useRef } from "react";
import adjustHeight from "@/features/todayTodos/lib/adjustTextareaHeight";

//adjust height of the todo description based on content size
export function useTodoFormFocusAndAutosize(displayForm: boolean) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    adjustHeight(textareaRef);
    if (displayForm) {
      titleRef.current?.focus();
    }
  }, [displayForm]);

  return { titleRef, textareaRef };
}
