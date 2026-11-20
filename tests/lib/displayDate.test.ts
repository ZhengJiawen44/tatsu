import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { getDisplayDate } from "@/lib/date/displayDate";

beforeEach(() => {
  // Monday 2026-11-09
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-11-09T12:00:00.000Z"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("last week's Tuesday shows a calendar date, not weekday", () => {
  expect(
    getDisplayDate(new Date("2026-11-03T00:00:00.000Z"), true, "en", "UTC"),
  ).toBe("Nov 3 12:00 AM");
});

test("same-week day after today shows weekday", () => {
  expect(
    getDisplayDate(new Date("2026-11-11T00:00:00.000Z"), true, "en", "UTC"),
  ).toBe("Wednesday 12:00 AM");
});
