import { toZonedTime } from "date-fns-tz";
import resolveTimezone from "./resolveTimezone";
import {
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  isSameDay,
} from "date-fns";
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}-${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return formatterCache.get(key)!;
}

// Translation keys for relative dates
const relativeTranslations: Record<string, Record<string, string>> = {
  en: {
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
  },
  ja: {
    today: "今日",
    tomorrow: "明日",
    yesterday: "昨日",
  },
  zh: {
    today: "今天",
    tomorrow: "明天",
    yesterday: "昨天",
  },
  es: {
    today: "Hoy",
    tomorrow: "Mañana",
    yesterday: "Ayer",
  },
  de: {
    today: "Heute",
    tomorrow: "Morgen",
    yesterday: "Gestern",
  },
  ar: {
    today: "اليوم",
    tomorrow: "غداً",
    yesterday: "أمس",
  },
  ru: {
    today: "Сегодня",
    tomorrow: "Завтра",
    yesterday: "Вчера",
  },
};

export function getDisplayDueDate(
  due: Date | undefined | null,
  dtstart: Date | undefined,
  displayTime?: boolean,
  locale: string = "en",
  timezone?: string,
) {
  if (!due) return "No Date";
  timezone = resolveTimezone(timezone);

  const translations = relativeTranslations[locale] || relativeTranslations.en;

  // Time string formatting with timezone
  let timeString = "";
  if (displayTime) {
    const timeFormatter = getFormatter(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone, //  Use consistent timezone
    });
    timeString = ` ${timeFormatter.format(due)}`;
  }

  const dueIsSameDay = dtstart ? isSameDay(due, dtstart) : 0;

  // due is same day as dtstart
  if (dueIsSameDay) return timeString.trimStart();

  const dateFormatter = getFormatter(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  });
  const sameYearDateFormatter = getFormatter(locale, {
    month: "short",
    day: "numeric",
    timeZone: timezone, //  Use consistent timezone
  });

  //   console.log(due, new Date());

  // due is not same day as dtstart
  return isToday(toZonedTime(due, timezone))
    ? `${translations.today}${timeString}`
    : isTomorrow(toZonedTime(due, timezone))
      ? `${translations.tomorrow}${timeString}`
      : isYesterday(due)
        ? `${translations.yesterday}${timeString}`
        : isSameYear(due, new Date())
          ? `${dateFormatter.format(due)}${timeString}`
          : `${sameYearDateFormatter.format(due)}${timeString}`;
}
