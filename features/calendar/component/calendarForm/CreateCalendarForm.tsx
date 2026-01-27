import PriorityDropdownMenu from "./PriorityDropdown";
import DateDropdownMenu from "./DateDropdownMenu";
import { TodoItemType, NonNullableDateRange } from "@/types";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
import { AlignLeft, Clock, Flag, Repeat } from "lucide-react";
import { useCreateCalendarTodo } from "../../query/create-calendar-todo";
import ConfirmCancelEditDialog from "./ConfirmCancelEdit";
import { useEffect, useMemo, useState } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";

type CreateCalendarFormProps = {
  start: Date;
  end: Date;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateCalendarForm = ({
  start,
  end,
  displayForm,
  setDisplayForm,
}: CreateCalendarFormProps) => {
  const appDict = useTranslations("app");
  const todayDict = useTranslations("today");

  const [cancelEditDialogOpen, setCancelEditDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TodoItemType["priority"]>("Low");
  const [dateRange, setDateRange] = useState<NonNullableDateRange>({
    from: start,
    to: end,
  });
  const [rruleOptions, setRruleOptions] = useState<Partial<Options> | null>(
    null,
  );

  const { createCalendarTodo, createTodoStatus } = useCreateCalendarTodo();

  const hasUnsavedChanges = useMemo(() => {
    const rruleString = rruleOptions
      ? RRule.optionsToString(rruleOptions)
      : null;

    return (
      title !== "" ||
      description !== "" ||
      priority !== "Low" ||
      dateRange.from?.getTime() !== start.getTime() ||
      dateRange.to?.getTime() !== end.getTime() ||
      rruleString !== null
    );
  }, [
    rruleOptions,
    title,
    description,
    priority,
    dateRange.from,
    dateRange.to,
    start,
    end,
  ]);

  useEffect(() => {
    if (createTodoStatus === "success") {
      setDisplayForm(false);
    }
  }, [createTodoStatus, setDisplayForm]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setCancelEditDialogOpen(true);
      return;
    }
    setDisplayForm(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && displayForm) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [displayForm, hasUnsavedChanges]);

  if (!displayForm) return null;

  return (
    <>
      <ConfirmCancelEditDialog
        cancelEditDialogOpen={cancelEditDialogOpen}
        setCancelEditDialogOpen={setCancelEditDialogOpen}
        setDisplayForm={setDisplayForm}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // defer close to avoid click-through
          requestAnimationFrame(() => handleClose());
        }}
      >

        {/* Modal */}
        <div
          className="bg-background rounded-lg w-full max-w-lg p-6"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <form
            className="flex flex-col gap-5 mt-2 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              createCalendarTodo({
                title,
                description,
                priority,
                dtstart: start,
                due: end,
                rrule: rruleOptions
                  ? new RRule(rruleOptions).toString()
                  : null,
              });
            }}
          >
            {/* Title */}
            <div className="flex items-start gap-4">
              <input
                className="ml-9 flex-1 min-w-0 bg-transparent border-b border-border py-1 text-lg focus:outline-none focus:border-lime"
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
                className="px-4 py-2 rounded-md text-sm hover:bg-red hover:text-accent-foreground"
                onClick={handleClose}
              >
                {appDict("cancel")}
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-md brightness-90 hover:brightness-100 bg-lime text-white text-sm"
              >
                {appDict("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCalendarForm;
