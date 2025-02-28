import Caret from "@/components/ui/icon/caret";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import clsx from "clsx";
import React, { SetStateAction, useState } from "react";
import { useMenu } from "@/providers/MenuProvider";
import { useCreateNote, useNote } from "@/hooks/useNote";
import { useCurrentNote } from "@/providers/NoteProvider";
import Plus from "@/components/ui/icon/plus";
import Spinner from "@/components/ui/spinner";
import NoteItem from "../BottomPanel/NoteSidebar/NoteSidebarItem";
import CaretOutline from "@/components/ui/icon/caretOutline";

interface NoteCollapsibleProps {
  openSection: string | null;
  setOpenSection: React.Dispatch<SetStateAction<string | null>>;
}
const NoteCollapsible = ({
  openSection,
  setOpenSection,
}: NoteCollapsibleProps) => {
  const { activeMenu, setActiveMenu, setShowMobileSidebar } = useMenu();
  const toggleOpen = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const { setCurrentNote } = useCurrentNote();
  //create a new note
  const { createNote, createLoading } = useCreateNote({
    onSuccess: (newNote) => setCurrentNote(newNote),
  });
  //get all notes
  const { notes } = useNote();

  return (
    <Collapsible
      open={openSection === "Note"}
      onOpenChange={() => toggleOpen("Note")}
      className="w-full "
    >
      <CollapsibleTrigger
        className={clsx(
          "hover:text-white",
          activeMenu === "Note" && "text-white"
        )}
      >
        <div className="flex gap-1 justify-center items-center">
          <CaretOutline
            className={clsx(
              "w-5 h-5 transition-transform duration-300 stroke-card-foreground",
              openSection === "Note" && "rotate-90"
            )}
          />
          Note
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="max-h-72 w-full ml-7 flex flex-col gap-2 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border mb-3">
        <button
          className="flex pl-2 gap-3 justify-start items-center hover:text-white pt-3"
          onClick={() => createNote({ name: "new page" })}
        >
          {createLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          create
        </button>
        {notes.map((note) => {
          return (
            <NoteItem
              onClick={() => {
                setShowMobileSidebar(false);
                setActiveMenu("Note");
                localStorage.setItem("prevTab", "Note");
                localStorage.setItem("prevNote", note.id);
              }}
              key={note.id}
              note={note}
            />
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NoteCollapsible;
