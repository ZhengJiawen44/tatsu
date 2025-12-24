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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";

type weekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
type byweekdayType = Set<weekday> | null;

const CustomRepeatModalMenu = ({ className }: { className?: string }) => {
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatFreqType, setRepeatFreqType] = useState("Day");
  const [byweekday, setByweekday] = useState<byweekdayType>(null);
  const [repeatEnd, setRepeatEnd] = useState<Date | null | undefined>(null);
  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger className={className}>Custom</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium select-none">
            Custom Repeat
          </DialogTitle>
          <DialogDescription className="select-none">
            Set up a custom repeat schedule
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <div className="flex flex-col gap-6 mb-2">
          <div className="flex flex-col gap-2">
            <p className="font-medium2">Every</p>
            <div className="flex gap-2 w-1/2 m-0 p-0">
              {/* repeatInterval count input */}
              <Input
                className="w-1/2 border-border"
                type="number"
                min={1}
                value={repeatInterval}
                onChange={(e) => setRepeatInterval(parseInt(e.target.value))}
              ></Input>
              {/* repeatInterval type input */}
              <NativeSelect className="min-w-1/2 h-full border-border hover:bg-accent">
                <NativeSelectOption
                  value={"Day"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Days" : "Day"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Week"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Weeks" : "Week"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Month"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Months" : "Month"}
                </NativeSelectOption>
                <NativeSelectOption
                  value={"Year"}
                  onClick={(e) => setRepeatFreqType(e.currentTarget.value)}
                >
                  {repeatInterval > 1 ? "Years" : "Year"}
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium select-none">On</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Checkbox id="Mo" className="" />
                <label htmlFor="Mo">Mo</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="Tu" />
                <label htmlFor="Tu">Tu</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="We" />
                <label htmlFor="We">We</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="Th" />
                <label htmlFor="Th">Th</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="Fr" />
                <label htmlFor="Fr">Fr</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="Sa" />
                <label htmlFor="Sa">Sa</label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox id="Su" />
                <label htmlFor="Su">Su</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium select-none">ends</p>
            <RadioGroup>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="never"
                  id="never"
                  checked={repeatEnd ? false : true}
                  onClick={() => setRepeatEnd(null)}
                />
                <label htmlFor="never">never</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="exDate"
                  id="exDate"
                  checked={repeatEnd ? true : false}
                  onClick={() => setRepeatEnd(new Date())}
                />
                <label htmlFor="exDate">on Date (inclusive)</label>
                {/* date picker */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className={clsx(
                        "w-48 justify-between font-normal border-border opacity-0",
                        repeatEnd && "opacity-100",
                      )}
                    >
                      {repeatEnd
                        ? repeatEnd.toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={repeatEnd || new Date()}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setRepeatEnd(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomRepeatModalMenu;
