import { useCallback } from "react";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { endOfDay, startOfDay } from "date-fns";

export function useClearInput(
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>,
  titleRef: React.RefObject<HTMLInputElement | null>,
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
      if (setEditInstanceOnly) setEditInstanceOnly(false);
      setDesc("");
      setTitle("");
      setDateRange({
        from: todoItem?.dtstart ? todoItem.dtstart : startOfDay(new Date()),
        to: todoItem?.due ? todoItem.due : endOfDay(new Date()),
      });
      setPriority("Low");
      setRruleOptions(null);
      titleRef.current?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todoItem?.due, todoItem?.dtstart],
  );
  return clearInput;
}
