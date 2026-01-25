// lib/getDisplayDate.ts
import {
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  startOfWeek,
  addWeeks,
  differenceInDays,
  isSameWeek,
} from "date-fns";

// Cache formatters to avoid recreating them on every call (PERFORMANCE OPTIMIZATION)
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
    next: "Next",
  },
  ja: {
    today: "今日",
    tomorrow: "明日",
    yesterday: "昨日",
    next: "来週の",
  },
  zh: {
    today: "今天",
    tomorrow: "明天",
    yesterday: "昨天",
    next: "下周",
  },
  es: {
    today: "Hoy",
    tomorrow: "Mañana",
    yesterday: "Ayer",
    next: "Próximo",
  },
  de: {
    today: "Heute",
    tomorrow: "Morgen",
    yesterday: "Gestern",
    next: "Nächster",
  },
  ar: {
    today: "اليوم",
    tomorrow: "غداً",
    yesterday: "أمس",
    next: "القادم",
  },
  ru: {
    today: "Сегодня",
    tomorrow: "Завтра",
    yesterday: "Вчера",
    next: "Следующий",
  },
};

export function getDisplayDate(date: Date, locale: string = "en"): string {
  const now = new Date();
  const translations = relativeTranslations[locale] || relativeTranslations.en;

  // Handle today, tomorrow, yesterday
  if (isToday(date)) return translations.today;
  if (isTomorrow(date)) return translations.tomorrow;
  if (isYesterday(date)) return translations.yesterday;

  // Handle this week (show day name)
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    const weekdayFormatter = getFormatter(locale, { weekday: "long" });
    return weekdayFormatter.format(date);
  }

  // Handle next week
  const nextWeekStart = addWeeks(startOfWeek(now, { weekStartsOn: 0 }), 1);
  if (isSameWeek(date, nextWeekStart, { weekStartsOn: 0 })) {
    const weekdayFormatter = getFormatter(locale, { weekday: "long" });
    const dayName = weekdayFormatter.format(date);

    // Different word order for different languages
    if (locale === "ja" || locale === "zh") {
      return `${translations.next}${dayName}`;
    }
    return `${translations.next} ${dayName}`;
  }

  // Handle dates within the next 7-14 days
  const daysDiff = differenceInDays(date, now);
  if (daysDiff > 0 && daysDiff <= 14) {
    const mediumFormatter = getFormatter(locale, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    return mediumFormatter.format(date);
  }

  // Default: show date with or without year
  if (date.getFullYear() === now.getFullYear()) {
    const shortFormatter = getFormatter(locale, {
      month: "short",
      day: "numeric",
    });
    return shortFormatter.format(date);
  } else {
    const longFormatter = getFormatter(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return longFormatter.format(date);
  }
}
