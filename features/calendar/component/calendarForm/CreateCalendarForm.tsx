import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Options, RRule } from "rrule";
import { AlignLeft, Clock, Flag, Repeat } from "lucide-react";

import { TodoItemType, NonNullableDateRange } from "@/types";
import { useCreateCalendarTodo } from "../../query/create-calendar-todo";

import PriorityDropdownMenu from "./PriorityDropdown";
import DateDropdownMenu from "./DateDropdownMenu";
import RepeatDropdownMenu from "./RepeatDropdown/RepeatDropdownMenu";
import ConfirmCancelEditDialog from "./ConfirmCancelEdit";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

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
  const [priority, setPriority] = useState<TodoItemType["priority"]>("Low");
  const [dateRange, setDateRange] = useState<NonNullableDateRange>({
    from: start,
    to: end,
  });
  const [rruleOptions, setRruleOptions] = useState<Partial<Options> | null>(null);

  const { createCalendarTodo, createTodoStatus } = useCreateCalendarTodo();

  const hasUnsavedChanges = useMemo(() => {
    const rruleString = rruleOptions ? RRule.optionsToString(rruleOptions) : null;
    return (
      title !== "" ||
      description !== "" ||
      priority !== "Low" ||
      dateRange.from?.getTime() !== start.getTime() ||
      dateRange.to?.getTime() !== end.getTime() ||
      rruleString !== null
    );
  }, [rruleOptions, title, description, priority, dateRange, start, end]);

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

  return (
    <>
      <ConfirmCancelEditDialog
        cancelEditDialogOpen={cancelEditDialogOpen}
        setCancelEditDialogOpen={setCancelEditDialogOpen}
        setDisplayForm={setDisplayForm}
      />

      <Modal open={displayForm} onOpenChange={(open) => {
        if (!open) handleClose();
      }}>
        <ModalOverlay>
          <ModalContent>
            <form
              className="flex flex-col gap-5 mt-2 min-w-0"
              onSubmit={(e) => {
                e.preventDefault();
                createCalendarTodo({
                  title,
                  description,
                  priority,
                  dtstart: dateRange.from || start,
                  due: dateRange.to || end,
                  rrule: rruleOptions ? new RRule(rruleOptions).toString() : null,
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

export default CreateCalendarForm;