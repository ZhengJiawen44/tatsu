import { CalendarTodoItemType } from "@/types";
import { useState } from "react";
import PriorityDropdownMenu from "./PriorityDropdown";
import DateDropdownMenu from "./DateDropdownMenu";
import { NonNullableDateRange } from "@/types";
import { RRule } from "rrule";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
import { AlignLeft, Clock, Flag, Repeat } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

type CalendarFormProps = {
  todo: CalendarTodoItemType;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalendarForm = ({
  todo,
  displayForm,
  setDisplayForm,
}: CalendarFormProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [priority, setPriority] = useState(todo.priority);
  const [dateRange, setDateRange] = useState<NonNullableDateRange>({
    from: todo.dtstart,
    to: todo.due,
  });
  const [rruleOptions, setRruleOptions] = useState(
    todo?.rrule ? RRule.parseString(todo.rrule) : null,
  );

  return (
    <Popover open={displayForm} onOpenChange={setDisplayForm}>
      <PopoverTrigger asChild>
        <div
          className="absolute right-1/2 h-full cursor-pointer w-0"
          title={todo.title}
        ></div>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-6 bg-input">
        {/* FORM */}
        <div className="flex flex-col gap-5 mt-4">
          {/* Title */}
          <div className="flex items-start gap-4">
            <input
              className="ml-9 flex-1 bg-transparent border-b border-border py-1 text-lg focus:outline-none focus:border-lime"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <Clock className="w-4 h-4 text-muted-foreground mt-1" />
            <div className="flex-1">
              <DateDropdownMenu
                todo={todo}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>

          {/* Repeat */}
          <div className="flex items-start gap-4">
            <Repeat className="w-4 h-4 text-muted-foreground mt-1" />
            <div className="flex-1">
              <RepeatDropdownMenu
                rruleOptions={rruleOptions}
                setRruleOptions={setRruleOptions}
                derivedRepeatType={null}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-start gap-4">
            <Flag className="w-4 h-4 text-muted-foreground mt-1" />
            <div className="flex-1">
              <PriorityDropdownMenu
                priority={priority}
                setPriority={setPriority}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-4">
            <AlignLeft className="w-4 h-4 text-muted-foreground mt-1" />
            <textarea
              className="flex-1 bg-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime"
              rows={3}
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md text-sm hover:bg-red hover:text-accent-foreground"
            onClick={() => setDisplayForm(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md brightness-90 hover:brightness-100 bg-lime text-white text-sm hover:bg-lime"
            onClick={() => {
              // submit mutation
              setDisplayForm(false);
            }}
          >
            Save
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarForm;
