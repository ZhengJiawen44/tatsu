
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

export function getDisplayDate(date: Date, displayTime?: boolean, locale: string = "en") {
  const today = new Date();
  const currentDate = new Date(date);

  const translations = relativeTranslations[locale] || relativeTranslations.en;

  // Time string formatting
  let timeString = "";
  if (displayTime) {
    const timeFormatter = getFormatter(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    timeString = ` ${timeFormatter.format(currentDate)}`;
  }

  // Normalize both to *local* midnight
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentDateMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  // Difference in days (positive = past, negative = future)
  const diffInDays = Math.floor(
    (todayMidnight.getTime() - currentDateMidnight.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  // Today
  if (diffInDays === 0) return `${translations.today}${timeString}`;

  // Yesterday
  if (diffInDays === 1) return `${translations.yesterday}${timeString}`;

  // Tomorrow
  if (diffInDays === -1) return `${translations.tomorrow}${timeString}`;

  // Within this week (past or future, within 6 days)
  if (Math.abs(diffInDays) <= 6) {
    const weekdayFormatter = getFormatter(locale, { weekday: "long" });
    const weekday = weekdayFormatter.format(currentDate);
    return `${weekday}${timeString}`;
  }

  // Same year, show date and month
  if (today.getFullYear() === currentDate.getFullYear()) {
    const dateFormatter = getFormatter(locale, {
      month: "short",
      day: "numeric",
    });
    return `${dateFormatter.format(currentDate)}${timeString}`;
  }

  // Different year, show full date
  const dateFormatter = getFormatter(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${dateFormatter.format(currentDate)}${timeString}`;
}