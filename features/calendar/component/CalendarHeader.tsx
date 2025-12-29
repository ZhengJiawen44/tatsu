import { HeaderProps } from "react-big-calendar";
import clsx from "clsx";
import { format, isToday } from "date-fns";

export default function CalendarHeader({ date }: HeaderProps) {
  const today = isToday(date);

  return (
    <div
      className={clsx(
        "flex items-center justify-center py-2 h-full",
        today && "text-accent font-semibold",
      )}
    >
      {/* Full day name - shown on large screens only */}
      <span className="hidden lg:inline text-sm font-medium text-foreground">
        {format(date, "EEEE")}
      </span>

      {/* Short day name (3 letters) - shown on mobile and tablet */}
      <span className="lg:hidden text-xs sm:text-sm font-medium text-foreground">
        {format(date, "EEE")}
      </span>
    </div>
  );
}
