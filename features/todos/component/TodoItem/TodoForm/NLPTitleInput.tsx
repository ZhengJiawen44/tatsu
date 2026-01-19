import { getCaretOffset } from "@/features/todos/lib/getCaretOffset";
import { setCaretOffset } from "@/features/todos/lib/setCaretOffset";
import { NonNullableDateRange } from "@/types";
import * as chrono from "chrono-node";
import { endOfDay } from "date-fns";
import React, { SetStateAction, useEffect, useRef } from "react";

type NLPTitleInputProps = {
  titleRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;
  setDateRange: React.Dispatch<SetStateAction<NonNullableDateRange>>;
};
/**
 * @description custom element for nlp assisted title input.
 * 1. uses the chrono-node library to parse input.
 * 2. uses a custom contentEditable element to wrap a decorative span around the parsed date.
 * The decorated part is removed from the title before being submitted
 *
 * controls two parameters:
 * 1. title: the react state value to submit. Stores the actual value of the title
 * 2. titleRef: the ref for the title input. Acts as a "rich text" display for the form
 *
 */
export default function NLPTitleInput({
  titleRef,
  title,
  setTitle,
  setDateRange,
}: NLPTitleInputProps) {
  const isComposing = useRef(false);

  //initialize titleRef value
  useEffect(() => {
    const titleNode = titleRef.current;
    if (titleNode && !titleNode.textContent) {
      titleNode.textContent = title;
      moveCursorToEnd(titleNode);
    }
  }, [title, titleRef]);

  return (
    <div className="relative text-[1.1rem] font-semibold ">
      <div
        contentEditable
        suppressContentEditableWarning
        onCompositionStart={() => (isComposing.current = true)}
        onCompositionEnd={() => (isComposing.current = false)}
        onInput={() => {
          if (isComposing.current) return;

          const titleNode = titleRef.current;
          if (!titleNode) return;

          const caret = getCaretOffset(titleNode);
          const fullText = titleNode.textContent ?? "";

          // parse the first date
          const parsedResults = chrono.parse(fullText);
          if (!parsedResults.length) {
            titleNode.innerHTML = fullText;
            setTitle(fullText);
            setCaretOffset(titleNode, caret);
            return;
          }

          const {
            index: parsedIndex,
            text: parsedText,
            start,
            end,
          } = parsedResults[0];
          const parsedStartDate = start.date();
          const parsedEndDate = end?.date();
          const parsedTextStart = parsedIndex;
          const parsedTextEnd = parsedIndex + parsedText.length;

          setDateRange({
            from: parsedStartDate,
            to: parsedEndDate || endOfDay(parsedStartDate),
          });

          // build highlighted HTML
          const tokenizedText = [];
          tokenizedText.push(fullText.slice(0, parsedTextStart));
          tokenizedText.push(
            `<span class="bg-nlp rounded-sm p-1">${fullText.slice(
              parsedTextStart,
              parsedTextEnd,
            )}</span>`,
          );
          tokenizedText.push(fullText.slice(parsedTextEnd));

          titleNode.innerHTML = tokenizedText.join("");

          // remove the date text from state title
          const cleanTitle =
            fullText.slice(0, parsedTextStart) + fullText.slice(parsedTextEnd);

          setTitle(cleanTitle);

          // restore caret
          setCaretOffset(titleNode, caret);
        }}
        ref={titleRef}
        className="z-50 focus:outline-none"
      />

      {!title.length && !(titleRef.current?.textContent ?? "").length && (
        <span className="select-none pointer-events-none z-10 absolute top-0 left-0">
          Read chapter 6 in 5 days
        </span>
      )}
    </div>
  );
}

function moveCursorToEnd(titleNode: Node) {
  const range = document.createRange();
  range.selectNodeContents(titleNode);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
