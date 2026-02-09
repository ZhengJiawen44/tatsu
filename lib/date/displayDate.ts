import resolveTimezone from "./resolveTimezone";

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

export function getDisplayDate(
  date: Date,
  displayTime?: boolean,
  locale: string = "en",
  timezone?: string,
) {
  timezone = resolveTimezone(timezone);

  const translations = relativeTranslations[locale] || relativeTranslations.en;

  //  Get current date in the specified timezone
  const nowInTimezone = new Date(
    new Date().toLocaleString("en-US", { timeZone: timezone }),
  );

  //  Get the input date in the specified timezone
  const dateInTimezone = new Date(
    date.toLocaleString("en-US", { timeZone: timezone }),
  );

  // Time string formatting with timezone
  let timeString = "";
  if (displayTime) {
    const timeFormatter = getFormatter(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone, //  Use consistent timezone
    });
    timeString = ` ${timeFormatter.format(date)}`;
  }

  //  Normalize both to midnight in the specified timezone
  const todayMidnight = new Date(
    nowInTimezone.getFullYear(),
    nowInTimezone.getMonth(),
    nowInTimezone.getDate(),
  );

  const currentDateMidnight = new Date(
    dateInTimezone.getFullYear(),
    dateInTimezone.getMonth(),
    dateInTimezone.getDate(),
  );

  // Difference in days
  const diffInDays = Math.floor(
    (todayMidnight.getTime() - currentDateMidnight.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Today
  if (diffInDays === 0) return `${translations.today}${timeString}`;

  // Yesterday
  if (diffInDays === 1) return `${translations.yesterday}${timeString}`;

  // Tomorrow
  if (diffInDays === -1) return `${translations.tomorrow}${timeString}`;

  // Within this week
  if (Math.abs(diffInDays) <= 6) {
    const weekdayFormatter = getFormatter(locale, {
      weekday: "long",
      timeZone: timezone, //  Use consistent timezone
    });
    const weekday = weekdayFormatter.format(date);
    return `${weekday}${timeString}`;
  }

  // Same year
  if (nowInTimezone.getFullYear() === dateInTimezone.getFullYear()) {
    const dateFormatter = getFormatter(locale, {
      month: "short",
      day: "numeric",
      timeZone: timezone, //  Use consistent timezone
    });
    return `${dateFormatter.format(date)}${timeString}`;
  }

  // Different year
  const dateFormatter = getFormatter(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone, //  Use consistent timezone
  });
  return `${dateFormatter.format(date)}${timeString}`;
}
