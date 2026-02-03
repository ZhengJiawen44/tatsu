import { getCaretOffset } from "@/components/todo/lib/getCaretOffset";
import { setCaretOffset } from "@/components/todo/lib/setCaretOffset";
import { cn } from "@/lib/utils";
import { NonNullableDateRange } from "@/types";
import * as chrono from "chrono-node";
import { addHours } from "date-fns";
import React, { SetStateAction, useEffect, useRef, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { NLPProjectDropdown } from "./NLPProjectDropdown";

// --------------------------- NLPTitleInput ---------------------------

type NLPTitleInputProps = {
  titleRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;
  setDateRange: React.Dispatch<SetStateAction<NonNullableDateRange>>;
  className?: string;
};

/**
 * NLP-assisted title input with Chrono highlighting and project dropdown.
 *
 * Keyboard features:
 * - Tab: selects the current/top result when dropdown is visible
 * - ArrowUp / ArrowDown: move selection in dropdown
 * - Enter: select highlighted result
 * - Escape: close dropdown
 */
export default function NLPTitleInput({
  titleRef,
  title,
  setTitle,
  setDateRange,
  className,
}: NLPTitleInputProps) {
  const locale = useLocale();
  const todayDict = useTranslations("today");
  const isComposing = useRef(false);

  // --- Dropdown state ---
  const [projectDropdownVisible, setProjectDropdownVisible] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [dropdownCoords, setDropdownCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { projectMetaData } = useProjectMetaData();
  const { setProjectID } = useTodoForm();

  // compute filtered projects here so parent knows the list length
  const filteredProjects = useMemo(() => {
    const entries = Object.entries(projectMetaData || {});
    if (!projectQuery.trim()) return entries;
    const lowerQuery = projectQuery.toLowerCase();
    return entries.filter(([, value]) => value.name.toLowerCase().includes(lowerQuery));
  }, [projectMetaData, projectQuery]);

  // Initialize contentEditable
  useEffect(() => {
    const node = titleRef.current;
    if (node && !node.textContent) {
      node.textContent = title;
      moveCursorToEnd(node);
    }
  }, [title, titleRef]);

  // --- Helpers ---

  const parseDate = (text: string) => {
    switch (locale) {
      case "ja":
        return chrono.ja.parse(text);
      case "fr":
        return chrono.fr.parse(text);
      case "ru":
        return chrono.ru.parse(text);
      case "es":
        return chrono.es.parse(text);
      case "it":
        return chrono.it.parse(text);
      case "de":
        return chrono.de.parse(text);
      case "pt":
        return chrono.pt.parse(text);
      case "zh":
        return chrono.zh.parse(text);
      default:
        return chrono.en.parse(text);
    }
  };

  const highlightText = (text: string, parsedResult: chrono.ParsedResult) => {
    const { index, text: matchedText, start, end } = parsedResult;

    const from = start.date();
    const to = end?.date() ?? addHours(from, 3);
    setDateRange({ from, to });

    const before = text.slice(0, index);
    const highlighted = `<span class="bg-nlp inline rounded-[2px]">${text.slice(
      index,
      index + matchedText.length
    )}</span>`;
    const after = text.slice(index + matchedText.length);

    return { html: before + highlighted + after, cleanTitle: before + after };
  };

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /**
   * Highlight project tokens in an HTML fragment without destroying existing markup.
   * `baseHtml` is the HTML (may contain chrono <span>), `cleanTitle` is the plain text
   * string that we'll keep as the canonical "clean" title (so we don't reintroduce the date
   * into setTitle).
   */
  const highlightProjectsInHtml = (baseHtml: string, cleanTitle: string) => {
    if (!projectMetaData) return { html: baseHtml, cleanText: cleanTitle };

    const names = Object.values(projectMetaData).map((p) => p.name);
    if (!names.length) return { html: baseHtml, cleanText: cleanTitle };

    // regex to match #ProjectName with lookahead for space or end
    const regex = new RegExp(`(#(${names.map((n) => escapeRegExp(n)).join("|")}))(?=\\s|$)`, "g");

    // DOM-based safe replacement: traverse text nodes and replace matches with spans
    const container = document.createElement("div");
    container.innerHTML = baseHtml;

    const walker = (node: Node) => {
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          let lastIndex = 0;
          let match: RegExpExecArray | null = null;
          const frag = document.createDocumentFragment();
          regex.lastIndex = 0;
          while ((match = regex.exec(text)) !== null) {
            const mIndex = match.index;
            if (mIndex > lastIndex) {
              frag.appendChild(document.createTextNode(text.slice(lastIndex, mIndex)));
            }
            const span = document.createElement("span");
            span.className = "bg-nlp inline rounded-[2px]";
            span.setAttribute("data-project", "");
            span.textContent = match[0];
            frag.appendChild(span);
            lastIndex = mIndex + match[0].length;
          }
          if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
          }
          // only replace if we found matches
          if (frag.childNodes.length > 0 && frag.childNodes.length !== 1 || (frag.firstChild && frag.firstChild.textContent !== text)) {
            child.parentNode?.replaceChild(frag, child);
          }
          regex.lastIndex = 0;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // don't descend into existing project spans to avoid double-wrapping,
          // but allow descent otherwise
          const el = child as HTMLElement;
          if (el.getAttribute("data-project") == null) {
            walker(child);
          }
        }
      });
    };

    walker(container);

    return { html: container.innerHTML, cleanText: cleanTitle };
  };

  const applyNLPHighlighting = (text: string) => {
    let html = text;
    let cleanTitle = text;

    // --- Chrono ---
    const parsedResults = parseDate(text);
    if (parsedResults.length) {
      const res = highlightText(text, parsedResults[0]);
      html = res.html;
      cleanTitle = res.cleanTitle;
    }

    // --- Projects ---
    // Apply project highlighting to the current HTML (which still contains the chrono span),
    // but keep `cleanTitle` as the canonical plain text without the parsed date.
    const projectRes = highlightProjectsInHtml(html, cleanTitle);
    html = projectRes.html;

    return { html, cleanTitle };
  };

  const wrapProjectSpan = (name: string) => {
    return `<span class="bg-nlp inline rounded-[2px]" data-project>${"#" + name}</span>`;
  };

  // --- NLP Input handler ---
  const handleNLPInput = () => {
    if (isComposing.current) return;

    const node = titleRef.current;
    if (!node) return;

    const caret = getCaretOffset(node);
    const fullText = node.textContent ?? "";

    const { html, cleanTitle } = applyNLPHighlighting(fullText);

    // update the visible DOM with highlights (keeps date visible)
    node.innerHTML = html;

    // but only set the "title" state to the clean text (date removed)
    setTitle(cleanTitle);

    // restore caret to the same offset in the displayed content.
    // Because we didn't remove the date from the displayed html, the offset should map correctly.
    setCaretOffset(node, caret);
  };

  // --- Project Input handler ---
  const handleProjectInput = () => {
    if (isComposing.current) return;
    const node = titleRef.current;
    if (!node) return;
    const container = titleRef.current?.parentElement;
    if (!container) return;

    const caret = getCaretOffset(node);
    const text = node.textContent ?? "";

    // find the last '#' before caret
    const beforeCaret = text.slice(0, caret);
    const hashIndex = beforeCaret.lastIndexOf("#");

    if (hashIndex >= 0 && (hashIndex === 0 || /\s/.test(beforeCaret[hashIndex - 1]))) {
      const query = beforeCaret.slice(hashIndex + 1);

      // get caret coordinates for dropdown
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.bottom - containerRect.top;

      setProjectQuery(query);
      setDropdownCoords({ x, y });
      setProjectDropdownVisible(true);
      setSelectedIndex(0);
    } else {
      setProjectDropdownVisible(false);
    }
  };

  // --- Insert selected project ---
  const insertProjectToken = (project: { id: string; name: string }) => {
    const node = titleRef.current;
    if (!node) return;

    const caret = getCaretOffset(node);
    const text = node.textContent ?? "";
    const beforeCaret = text.slice(0, caret);
    const hashIndex = beforeCaret.lastIndexOf("#");
    if (hashIndex < 0) return;

    const before = beforeCaret.slice(0, hashIndex);
    const after = text.slice(caret);

    const html =
      before +
      wrapProjectSpan(project.name) +
      "&nbsp;" +
      after;

    node.innerHTML = html;
    setTitle(node.textContent ?? "");
    setProjectDropdownVisible(false);
    setProjectID?.(project.id);

    // move caret after inserted node
    requestAnimationFrame(() => {
      // position is before.length + project.name.length + 2 (for '#' and a trailing space)
      setCaretOffset(node, before.length + project.name.length + 2);
    });
  };

  // --- Keyboard handling for contentEditable ---
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isComposing.current) return;
    if (!projectDropdownVisible) return;

    const len = filteredProjects.length;
    if (!len) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();
        // select top result (or current selectedIndex if moved)
        insertProjectToken({ id: filteredProjects[selectedIndex][0], name: filteredProjects[selectedIndex][1].name });
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((s) => (s + 1) % len);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((s) => (s - 1 + len) % len);
        break;
      case "Enter":
        e.preventDefault();
        insertProjectToken({ id: filteredProjects[selectedIndex][0], name: filteredProjects[selectedIndex][1].name });
        break;
      case "Escape":
        e.preventDefault();
        setProjectDropdownVisible(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("relative text-[1.1rem] font-semibold", className)}>
      <div
        contentEditable
        suppressContentEditableWarning
        onCompositionStart={() => (isComposing.current = true)}
        onCompositionEnd={() => (isComposing.current = false)}
        onInput={() => {
          handleNLPInput();
          handleProjectInput();
        }}
        onKeyDown={onKeyDown}
        ref={titleRef}
        className="z-50 focus:outline-none"
        role="textbox"
        aria-multiline="true"
      />

      {!title.length && !(titleRef.current?.textContent ?? "").length && (
        <span className="select-none pointer-events-none z-10 absolute top-0 left-2">
          {todayDict("titlePlaceholder")}
        </span>
      )}

      {projectDropdownVisible && (
        <NLPProjectDropdown
          projects={filteredProjects}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          style={{
            position: "absolute",
            top: dropdownCoords.y,
            left: dropdownCoords.x,
          }}
          onSelect={(p) => insertProjectToken(p)}
        />
      )}
    </div>
  );
}

// Move caret to the end of contentEditable
function moveCursorToEnd(node: Node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
