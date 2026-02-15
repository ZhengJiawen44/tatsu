import { test, expect } from "@jest/globals";
import { genRule } from "@/lib/RRule/generateTodosFromRRule";

/**
 * These tests assume user is in China and the server uses UTC as its timezone.
 * these tests test {genRule}, which is time zone aware.
 * Calculations are done in user's time zone and returned in UTC format
 */

test("daily repeat generates 5 correct occurences", () => {
  const startedAt = new Date("2025-10-11T16:00:00Z"); // Oct-12-00:00 in China
  const rruleStr = "FREQ=DAILY;WKST=MO";
  const rule = genRule(rruleStr, startedAt, "Asia/Shanghai");
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-10-11T16:00:00.000Z"),
    new Date("2025-10-12T16:00:00.000Z"),
    new Date("2025-10-13T16:00:00.000Z"),
    new Date("2025-10-14T16:00:00.000Z"),
    new Date("2025-10-15T16:00:00.000Z"),
  ]);
});

test("weekly repeat on Tuesdays generates 5 correct occurences", () => {
  const startedAt = new Date("2025-12-01T16:00:00Z"); // Dec-02 Tu in china
  const rruleStr = "FREQ=WEEKLY;BYDAY=TU";
  const timeZone = "Asia/Shanghai";
  const rule = genRule(rruleStr, startedAt, timeZone);
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-12-01T16:00:00.000Z"),
    new Date("2025-12-08T16:00:00.000Z"),
    new Date("2025-12-15T16:00:00.000Z"),
    new Date("2025-12-22T16:00:00.000Z"),
    new Date("2025-12-29T16:00:00.000Z"),
  ]);
});

test("weekly repeat on Tuesdays and Thursdays generates 5 correct occurences", () => {
  const startedAt = new Date("2025-12-01T16:00:00Z"); // Dec-02 Tu in china
  const rruleStr = "FREQ=WEEKLY;BYDAY=TU,TH";
  const timeZone = "Asia/Shanghai";
  const rule = genRule(rruleStr, startedAt, timeZone);
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-12-01T16:00:00.000Z"),
    new Date("2025-12-03T16:00:00.000Z"),
    new Date("2025-12-08T16:00:00.000Z"),
    new Date("2025-12-10T16:00:00.000Z"),
    new Date("2025-12-15T16:00:00.000Z"),
  ]);
});

test("daily repeat at midnight boundary generates correct occurrences", () => {
  const startedAt = new Date("2025-10-11T16:00:00Z"); // Oct-12-00:00 in China
  const rruleStr = "FREQ=DAILY;WKST=MO";
  const rule = genRule(rruleStr, startedAt, "Asia/Shanghai");
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-10-11T16:00:00.000Z"),
    new Date("2025-10-12T16:00:00.000Z"),
    new Date("2025-10-13T16:00:00.000Z"),
    new Date("2025-10-14T16:00:00.000Z"),
    new Date("2025-10-15T16:00:00.000Z"),
  ]);
});

test("every January on Satuday generates correct occurrences", () => {
  const startedAt = new Date("2025-01-12T16:00:00Z"); // Jan-13-00:00 Mo in China
  const rruleStr = "FREQ=MONTHLY;COUNT=30;WKST=MO;BYDAY=SA;BYMONTH=1";
  const rule = genRule(rruleStr, startedAt, "Asia/Shanghai");
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-01-17T16:00:00.000Z"),
    new Date("2025-01-24T16:00:00.000Z"),
    new Date("2026-01-02T16:00:00.000Z"),
    new Date("2026-01-09T16:00:00.000Z"),
    new Date("2026-01-16T16:00:00.000Z"),
  ]);
});

// COUNT and UNTIL limits
// Daily repeat with COUNT=3 (should stop after 3 occurrences)
// Weekly repeat with UNTIL date set to 2 weeks from now
// Verify no todos generated when all occurrences are exhausted

test("repeat daily with count=3 generates 3 correct occurences", () => {
  const startedAt = new Date("2025-01-12T16:00:00Z"); // Jan-13-00:00 in China
  const rruleStr = "FREQ=DAILY;COUNT=3;WKST=MO";
  const rule = genRule(rruleStr, startedAt, "Asia/Shanghai");
  const occurences = rule.all();
  expect(occurences).toEqual([
    new Date("2025-01-12T16:00:00.000Z"),
    new Date("2025-01-13T16:00:00.000Z"),
    new Date("2025-01-14T16:00:00.000Z"),
  ]);
});

test("Weekly repeat with until date set to 2 weeks from now", () => {
  const startedAt = new Date("2025-12-01T17:00:00Z"); // Dec-02 01:00 Tu in china
  const rruleStr = "FREQ=WEEKLY;UNTIL=20251230T020000;WKST=MO"; //until Dec-30 02:00 Tu in China (until is already local time)
  const timeZone = "Asia/Shanghai";
  const rule = genRule(rruleStr, startedAt, timeZone);
  const occurences = rule.all((_, i) => i < 5);
  expect(occurences).toEqual([
    new Date("2025-12-01T17:00:00.000Z"),
    new Date("2025-12-08T17:00:00.000Z"),
    new Date("2025-12-15T17:00:00.000Z"),
    new Date("2025-12-22T17:00:00.000Z"),
    new Date("2025-12-29T17:00:00.000Z"),
  ]);
});
