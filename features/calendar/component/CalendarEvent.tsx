import { TodoItemType } from "@/types";
import React, { useState } from "react";
import { EventProps } from "react-big-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { AlignCenterIcon } from "lucide-react";
import clsx from "clsx";
import { Pen, Trash, X } from "lucide-react";
import LineSeparator from "@/components/ui/lineSeparator";
import CompleteButton from "./CompleteButton";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const ConfirmDelete = dynamic(() => import("./ConfirmationModals/ConfirmDelete"));
const ConfirmDeleteAll = dynamic(() => import("./ConfirmationModals/ConfirmDeleteAll"))
import EditCalendarFormContainer from "./CalendarForm/EditFormContainer";

const formatDateRange = (start: Date, end: Date) =>
  `${format(start, "MMM dd hh:mm")} - ${format(end, "MMM dd hh:mm")}`;

const CalendarEvent = ({ event: todo }: EventProps<TodoItemType>) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <>
      {/* ----------------- Event Form popover ----------- */}
      {displayForm && (
        <EditCalendarFormContainer
          todo={todo}
          displayForm={displayForm}
          setDisplayForm={setDisplayForm}
        />
      )}
      {/* ---------------- Event info popover ------------- */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="w-full h-full cursor-pointer z-50! text-foreground"
            title={todo.title}
            onContextMenu={(e) => {
              e.preventDefault();
              setOpen(true);
            }}

          >
            <p className="text-sm truncate max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
              {todo.title}
            </p>
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-screen sm:w-120 md:w-100 lg:w-120 bg-popover" onMouseDown={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex gap-0 md:gap-2 p-2 justify-end ">
            {/* EDIT */}
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:text-foreground text-muted-foreground p-2 rounded-md hover:bg-popover-accent"
              onClick={() => {
                setOpen(false);
                setDisplayForm(true);
              }}
            >
              <Pen className="w-3 h-3 sm:h-4 sm:w-4" />
            </Button>

            {/* DELETE  */}
            <Button
              variant={"destructive"}
              size={"icon"}
              className="hover:text-foreground text-muted-foreground p-2 rounded-md hover:bg-popover-accent bg-popover"
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
            </Button>

            {/* Close */}
            <Button
              variant={"destructive"}
              size={"icon"}
              className="hover:text-foreground text-muted-foreground p-2 rounded-md hover:bg-popover-accent bg-popover"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* TODO information */}
          <div className="flex flex-col gap-4 text-sm px-3 pt-1 pb-6 sm:px-6 md:px-8">
            <div className="flex items-start gap-4">
              <div
                className={clsx(
                  "min-w-4 min-h-4 sm:min-w-5 sm:min-h-5 md:min-w-6 md:min-h-6 rounded-sm mt-1",
                  todo.priority === "Low"
                    ? "bg-lime"
                    : todo.priority === "Medium"
                      ? "bg-orange"
                      : "bg-red",
                )}
              />
              <div className="min-w-0">
                <p className="text-md md:text-lg font-semibold leading-none truncate w-full">
                  {todo.title}
                </p>
                <p className="text-[0.6rem] sm:text-xs md:text-sm text-foreground">
                  {formatDateRange(todo.dtstart, todo.due)}
                </p>
              </div>
            </div>

            {todo.description && (
              <div className="flex gap-2 sm:gap-3 md:gap-4 items-start min-w-0">
                <AlignCenterIcon className="w-4 h-4 text-muted-foreground shrink-0 flex-0" />
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
