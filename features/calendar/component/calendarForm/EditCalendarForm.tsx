import { TodoItemType } from "@/types";
import { useEffect, useMemo, useState } from "react";
import PriorityDropdownMenu from "./PriorityDropdown";
import DateDropdownMenu from "./DateDropdownMenu";
import { NonNullableDateRange } from "@/types";
import { RRule } from "rrule";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
import { AlignLeft, Clock, Flag, Repeat } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmCancelEditDialog from "./ConfirmCancelEdit";
import ConfirmEditAllDialog from "./ConfirmEditAll";
import { useEditCalendarTodo } from "../../query/update-calendar-todo";
import { useTranslations } from "next-intl";

type CalendarFormProps = {
  todo: TodoItemType;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CalendarForm = ({
  todo,
  displayForm,
  setDisplayForm,
}: CalendarFormProps) => {
  const appDict = useTranslations("app");
  const todayDict = useTranslations("today");

  const dateRangeChecksum = useMemo(
    () => todo.dtstart.toISOString() + todo.due.toISOString(),
    [],
  );
  const rruleChecksum = useMemo(() => todo.rrule, []);
  const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);
  const [editAllDialogOpen, setEditAllDialogOpen] = useState(false);
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

  const hasUnsavedChanges = useMemo(() => {
    const rruleString = rruleOptions
      ? RRule.optionsToString(rruleOptions)
      : null;

    return (
      title !== todo.title ||
      description !== (todo.description ?? "") ||
      priority !== todo.priority ||
      dateRange.from?.getTime() !== todo.dtstart?.getTime() ||
      dateRange.to?.getTime() !== todo.due?.getTime() ||
      rruleString !== (todo.rrule ?? null)
    );
  }, [title, description, priority, dateRange, rruleOptions, todo]);
  const { editCalendarTodo, editTodoStatus } = useEditCalendarTodo();

  // Run side effect when editTodoStatus changes
  useEffect(() => {
    if (editTodoStatus === "success") {
      setDisplayForm(false);
    }
  }, [editTodoStatus, setDisplayForm]);

  return (
    <>
      <ConfirmCancelEditDialog
        cancelEditDialogOpen={cancelEditDialogOpen}
        setCancelEditDialogOpen={setCancelEditDialogOpen}
        setDisplayForm={setDisplayForm}
      />

      <ConfirmEditAllDialog
        todo={{
          ...todo,
          title,
          description,
          priority,
          dtstart: dateRange.from,
          due: dateRange.to,
          rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
        }}
        rruleChecksum={rruleChecksum!}
        dateRangeChecksum={dateRangeChecksum}
        setDisplayForm={setDisplayForm}
        editAllDialogOpen={editAllDialogOpen}
        setEditAllDialogOpen={setEditAllDialogOpen}
      />

      <Popover
        open={displayForm}
        onOpenChange={(open) => {
          // If the popover is trying to close and there are unsaved changes and the edit dialogue is not open,
          // show the cancel confirmation dialog instead
          if (open === false && hasUnsavedChanges && !editAllDialogOpen) {
            setCancelEditDialogOpen(true);
            return;
          }
          //if edit dialog is open and there are changes, disregard the on open change
          if (editAllDialogOpen && hasUnsavedChanges) {
            return;
          }

          setDisplayForm(open);
        }}
      >
        <PopoverTrigger asChild>
          <div
            className="absolute right-1/2 h-full cursor-pointer w-0"
            title={todo.title}
          />
        </PopoverTrigger>

        <PopoverContent
          className="w-[calc(100vw-2rem)] max-w-md min-w-0 border p-2 sm:p-6"
          onMouseDown={(e) => e.stopPropagation()}>
          <form
            className="flex min-w-0 flex-col gap-5 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (todo.rrule) {
                setEditAllDialogOpen(true);
              } else {
                editCalendarTodo({
                  ...todo,
                  title,
                  description,
                  priority,
                  dtstart: dateRange.from,
                  due: dateRange.to,
                });
              }
            }}
          >
            {/* Title */}
            <div className="flex min-w-0 items-start gap-4">
              <input
                className="ml-9 flex-1 min-w-0 bg-transparent border-b border-border  sm:text-lg focus:outline-none focus:border-lime"
                placeholder={todayDict("titlePlaceholder")}
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
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </div>
            </div>

            <div className="flex gap-7 sm:flex-col sm:gap-4">
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
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <AlignLeft className="w-4 h-4 text-muted-foreground mt-1" />
              <textarea
                className="flex-1 min-w-0 bg-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lime"
                rows={3}
                placeholder={appDict("descPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-md text-sm hover:bg-red hover:text-accent-foreground"
                onClick={() => setCancelEditDialogOpen(true)}
              >
                {appDict("cancel")}
              </button>

              <button
                type="submit"
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-md brightness-90 hover:brightness-100 bg-lime text-white text-sm hover:bg-lime"
              >
                {appDict("save")}
              </button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CalendarForm;