import { useCallback } from "react";
import { useTodoForm } from "@/providers/TodoFormProvider";

export function useClearInput(
  setEditInstanceOnly:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined,
  titleRef: React.RefObject<HTMLDivElement | null>,
) {
  const {
    todoItem,
    setDesc,
    setTitle,
    setDateRange,
    setPriority,
    setRruleOptions,
  } = useTodoForm();
  const clearInput = useCallback(
    function clearInput() {
      const now = new Date();
      now.setHours(now.getHours() + 3);
      if (setEditInstanceOnly) setEditInstanceOnly(false);
      setDesc("");
      setTitle("");
      setDateRange({
        from: todoItem?.dtstart ? todoItem.dtstart : new Date(),
        to: todoItem?.due ? todoItem.due : now,
      });
      setPriority("Low");
      setRruleOptions(null);
      titleRef.current?.focus();
      if (titleRef.current) {
        titleRef.current.textContent = "";
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoItem?.due, todoItem?.dtstart],
  );
  return clearInput;
}
