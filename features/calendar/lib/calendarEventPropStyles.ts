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
      outline: "none",
      border: "1px solid hsl(var(--border))",
      display: "flex",
      justifyContent: "start",
      padding: "2px",
      margin: "2px",
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  };
};
