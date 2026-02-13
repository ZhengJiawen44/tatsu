import { ProjectColor } from "@prisma/client";
import { projectColorMap } from "@/lib/projectColorMap";
export const calendarEventPropStyles = (
  priority: "High" | "Medium" | "Low",
  projectColor: ProjectColor | undefined,
) => {
  let eventBgColor: string;

  if (!projectColor) {
    switch (priority) {
      case "Low":
        eventBgColor = "hsl(var(--calendar-lime))";
        break;
      case "Medium":
        eventBgColor = "hsl(var(--calendar-orange))";
        break;
      case "High":
        eventBgColor = "hsl(var(--calendar-red))";
        break;
    }
  } else {
    const match = projectColorMap.find(({ value }) => value === projectColor);
    eventBgColor =
      `hsl(var(--${match?.tailwind.replace("bg-", "")})/0.7)` ||
      "hsl(var(--accent-blue)/0.7)";
  }

  return {
    style: {
      backgroundColor: eventBgColor,
      border: "0px solid rgba(255,255,255,0.12)",
      outline: "none",
      display: "flex",
      justifyContent: "start",
    },
  };
};
