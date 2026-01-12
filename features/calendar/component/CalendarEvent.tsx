import { CalendarTodoItemType } from "@/types";
import React, { useState } from "react";
import { EventProps } from "react-big-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { TbAlignJustified } from "react-icons/tb";
import clsx from "clsx";
import { Pen, Trash, X } from "lucide-react";
import CalendarForm from "./calendarForm/CalendarForm";
import LineSeparator from "@/components/ui/lineSeparator";
import ConfirmDelete from "./ConfirmDelete";
import ConfirmDeleteAll from "./ConfirmDeleteAll";
import CompleteButton from "./CompleteButton";

const formatDateRange = (start: Date, end: Date) =>
  `${format(start, "MMM dd hh:mm")} - ${format(end, "MMM dd hh:mm")}`;

const CalendarEvent = ({ event: todo }: EventProps<CalendarTodoItemType>) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <>
      {/* ----------------- Event Form popover ----------- */}
      <CalendarForm
        todo={todo}
        displayForm={displayForm}
        setDisplayForm={setDisplayForm}
      />
      {/* ---------------- Event info popover ------------- */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="w-full h-full cursor-pointer !z-50"
            title={todo.title}
            onContextMenu={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <p className="truncate max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
              {todo.title}
            </p>
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[11rem] sm:w-[20rem] md:w-[25rem] lg:w-[30rem] bg-input">
          {/* Header */}
          <div className="flex gap-0 md:gap-2 p-2 justify-end ">
            {/* EDIT */}
            <button
              className="hover:bg-lime hover:text-white text-foreground p-2 rounded-md"
              onClick={() => {
                setOpen(false);
                setDisplayForm(true);
              }}
            >
              <Pen className="w-3 h-3 sm:h-4 sm:w-4" />
            </button>

            {/* DELETE  */}
            <button
              className="hover:bg-lime hover:text-white text-foreground p-2 rounded-md"
              onClick={() => {
                setOpen(false);
                if (todo.rrule) {
                  setDeleteAllDialogOpen(true);
                } else {
                  setDeleteDialogOpen(true);
                }
              }}
            >
              <Trash className="w-3 h-3 sm:h-4 sm:w-4" />
            </button>

            {/* Close */}
            <button
              className="hover:bg-red hover:text-white text-foreground p-1 rounded-md flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* TODO information */}
          <div className="flex flex-col gap-4 text-sm px-3 pt-1 pb-6 sm:px-6 md:px-8">
            <div className="flex items-start gap-4">
              <div
                className={clsx(
                  "w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-sm mt-1",
                  todo.priority === "Low"
                    ? "bg-lime"
                    : todo.priority === "Medium"
                      ? "bg-orange"
                      : "bg-red",
                )}
              />
              <div>
                <p className="text-md md:text-lg font-semibold leading-none">
                  {todo.title}
                </p>
                <p className="text-[0.6rem] sm:text-xs md:text-sm text-foreground">
                  {formatDateRange(todo.dtstart, todo.due)}
                </p>
              </div>
            </div>

            {todo.description && (
              <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
                <TbAlignJustified className="w-3 h-3 sm:h-4 sm:w-4" />
                <p className="line-clamp-3 text-[0.7rem] md:text-sm">
                  {todo.description}
                </p>
              </div>
            )}
          </div>
          <LineSeparator />
          <CompleteButton todoItem={todo} />
        </PopoverContent>
      </Popover>

      {/* ---------------- CONFIRM DELETE DIALOG ---------------- */}
      <ConfirmDelete
        todo={todo}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
      <ConfirmDeleteAll
        todo={todo}
        deleteAllDialogOpen={deleteAllDialogOpen}
        setDeleteAllDialogOpen={setDeleteAllDialogOpen}
      />
    </>
  );
};

export default CalendarEvent;
