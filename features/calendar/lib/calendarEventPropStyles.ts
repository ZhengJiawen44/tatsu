import clsx from "clsx";
export const calendarEventPropStyles = (
  priority: "High" | "Medium" | "Low",
) => {
  return {
    style: {
      backgroundColor: clsx(
        priority == "Low"
          ? "hsl(var(--calendar-lime))"
          : priority == "Medium"
            ? "hsl(var(--calendar-orange))"
            : "hsl(var(--calendar-red))",
      ),
      border: "1px solid hsl(var(--border))",
      outline: "none",
      display: "flex",
      justifyContent: "start",
    },
  };
};
