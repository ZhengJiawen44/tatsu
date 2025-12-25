import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RepeatEveryOption from "./RepeatEveryOption";
import RepeatOnOption from "./RepeatOnOption";
import RepeatEndOption from "./RepeatEndOption";
import { CheckIcon } from "lucide-react";
import clsx from "clsx";
import { useTodoForm } from "@/providers/TodoFormProvider";
const CustomRepeatModalMenu = ({ className }: { className?: string }) => {
  const { repeatType } = useTodoForm();
  return (
    <Dialog>
      <DialogTrigger className={className}>
        <CheckIcon
          className={clsx("opacity-0", repeatType == "Custom" && "opacity-100")}
        />
        Custom
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">Custom Repeat</DialogTitle>
          <DialogDescription>Set up a custom repeat schedule</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mb-2">
          {/* rrule interval option */}
          <RepeatEveryOption />
          {/* rrule byday option */}
          <RepeatOnOption />
          {/* rrule until option */}
          <RepeatEndOption />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRepeatModalMenu;
