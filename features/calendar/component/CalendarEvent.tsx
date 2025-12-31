import { CalendarTodo } from "@/types";
import React, { useState } from "react";
import { EventProps } from "react-big-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const CalendarEvent = ({ event: todo }: EventProps<CalendarTodo>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full" title={todo.title}>
            <p className="truncate h-fit max-w-4 sm:max-w-8 md:max-w-9 lg:max-w-12 xl:max-w-32 2xl:max-w-40">
              {todo.title}
            </p>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4" side="right">
          {
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium leading-none">{todo.title}</p>

                <Button
                  className="border border-input/80"
                  size="sm"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>

              {todo.description && (
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-muted-foreground">{todo.description}</p>
                </div>
              )}

              <div>
                <p className="font-medium">Priority</p>
                <p
                  className={clsx(
                    "font-medium",
                    todo.priority === "High" && "text-red",
                    todo.priority === "Medium" && "text-orange",
                    todo.priority === "Low" && "text-lime",
                  )}
                >
                  {todo.priority}
                </p>
              </div>

              <div>
                <p className="font-medium">Starts</p>
                <p className="text-muted-foreground">
                  {format(todo.dtstart, "PPP p")}
                </p>
              </div>

              <div>
                <p className="font-medium">Ends</p>
                <p className="text-muted-foreground">
                  {format(todo.due, "PPP p")}
                </p>
              </div>

              {todo.rrule && (
                <div>
                  <p className="font-medium">Repeat Rule</p>
                  <p className="text-xs break-all text-muted-foreground">
                    {todo.rrule}
                  </p>
                </div>
              )}
            </div>
          }
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CalendarEvent;
