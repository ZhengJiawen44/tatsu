import { useEffect, useRef } from "react";

export function useKeyboardSubmitForm(
  displayForm: boolean,
  handleForm: () => void,
) {
  const scribbleAudio = useRef<HTMLAudioElement>(new Audio("/scribble.mp3"));

  useEffect(() => {
    const onCtrlEnter = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        scribbleAudio.current.play();
        if (displayForm) {
          handleForm();
        }
      }
    };
    document.addEventListener("keydown", onCtrlEnter);
    return () => document.removeEventListener("keydown", onCtrlEnter);
  }, [displayForm, handleForm]);
}
