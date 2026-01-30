import { useEffect } from "react";

export function useKeyboardSubmitForm(
  displayForm: boolean,
  handleForm: () => void,
) {
  useEffect(() => {
    const onCtrlEnter = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        if (displayForm) {
          handleForm();
        }
      }
    };
    document.addEventListener("keydown", onCtrlEnter);
    return () => document.removeEventListener("keydown", onCtrlEnter);
  }, [displayForm, handleForm]);
}
