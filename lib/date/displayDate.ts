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
  fr: {
    today: "Aujourd'hui",
    tomorrow: "Demain",
    yesterday: "Hier",
  },
  it: {
    today: "Oggi",
    tomorrow: "Domani",
    yesterday: "Ieri",
  },
  ms: {
    today: "Hari ini",
    tomorrow: "Esok",
    yesterday: "Semalam",
  },
  pt: {
    today: "Hoje",
    tomorrow: "Amanhã",
    yesterday: "Ontem",
  },
};

// hour12 Intl disagrees across engines: Node prints "0:00 a. m." and "上午0:00",
// browsers print "12:00 a. m." and "凌晨12:00". Build the clock here instead.
const timePatterns: Record<
  string,
  { am: string; pm: string; periodFirst: boolean }
> = {
  en: { am: "AM", pm: "PM", periodFirst: false },
  es: { am: "a. m.", pm: "p. m.", periodFirst: false },
  zh: { am: "上午", pm: "下午", periodFirst: true },
  ja: { am: "午前", pm: "午後", periodFirst: true },
  de: { am: "AM", pm: "PM", periodFirst: false },
  ar: { am: "ص", pm: "م", periodFirst: false },
  ru: { am: "AM", pm: "PM", periodFirst: false },
  fr: { am: "AM", pm: "PM", periodFirst: false },
  it: { am: "AM", pm: "PM", periodFirst: false },
  ms: { am: "PG", pm: "PT", periodFirst: false },
  pt: { am: "AM", pm: "PM", periodFirst: false },
};

function formatDisplayTime(date: Date, locale: string, timeZone: string) {
  const parts = getFormatter("en", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const hour24 = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const pattern = timePatterns[locale] ?? timePatterns.en;
  const period = hour24 < 12 ? pattern.am : pattern.pm;
  const clock = `${hour12}:${minute}`;
  return pattern.periodFirst ? `${period}${clock}` : `${clock} ${period}`;
}

export function getDisplayDate(
  date: Date | undefined | null,
  displayTime?: boolean,
  locale: string = "en",
  timezone?: string,
  abbreviateToday?: boolean,
) {
  if (!date) return "No Date";
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
    timeString = ` ${formatDisplayTime(date, locale, timezone)}`;
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
  if (diffInDays === 0) {
    if (!abbreviateToday) {
      return `${translations.today}${timeString}`;
    } else {
      return `${timeString.trimStart()}`;
    }
  }

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
