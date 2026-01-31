import { TodoItemType } from "@/types";
import { useEffect, useMemo, useState } from "react";
import PriorityDropdownMenu from "./PriorityDropdown/PriorityDropdown";
import DateDropdownMenu from "./DateDropdown/DateDropdownMenu";
import { NonNullableDateRange } from "@/types";
import { RRule } from "rrule";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
import { AlignLeft, Clock, Flag, Repeat } from "lucide-react";
import ConfirmCancelEditDialog from "./ConfirmCancelEdit";
import ConfirmEditAllDialog from "./ConfirmEditAll";
import { useEditCalendarTodo } from "../../query/update-calendar-todo";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

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
    [todo.dtstart, todo.due],
  );
  const rruleChecksum = useMemo(() => todo.rrule, [todo.rrule]);

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

  useEffect(() => {
    if (editTodoStatus === "success") {
      setDisplayForm(false);
    }
  }, [editTodoStatus, setDisplayForm]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setCancelEditDialogOpen(true);
      return;
    }
    setDisplayForm(false);
  };

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

      <Modal open={displayForm} onOpenChange={(open) => {
        if (!open) handleClose();
      }}>
        <ModalOverlay>
          <ModalContent>
            <form
              className="flex min-w-0 flex-col gap-5 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (todo.rrule) {
                  setEditAllDialogOpen(true);
                } else {
                  editCalendarTodo({
                    ...todo,
                    rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
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
                  className="ml-9 flex-1 min-w-0 bg-transparent border-b border-border sm:text-lg focus:outline-none focus:border-lime"
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
              <ModalFooter>
                <Button
                  type="button"
                  variant="ghost"
                  className="hover:bg-red hover:text-white"
                  onClick={handleClose}
                >
                  {appDict("cancel")}
                </Button>

                <Button
                  type="submit"
                  className="bg-lime text-white hover:bg-lime/90"
                >
                  {appDict("save")}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default CalendarForm;