import getTodayBoundaries from "@/lib/getTodayBoundaries";
import { TodoBuilder } from "../lib/todoBuilder";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";

/*
 *   scenario
 *  _____________________________________________________________________________________
 * |            Jan-1           |           Jan-2           |           Jan-3           |
 * |____________________________|___________________________|___________________________|
 * |  >>------------------------|-------------------------> |                           |
 * |            TODO            |                     23:59 |                           |
 * |    start:Jan1; due:Jan2    |           Today           |                           |
 * |    RRULE: FREQ=WEEKLY      |                           |                           |
 * |____________________________|___________________________|___________________________|
 *
 *  above scenario depicts the follwoing:
 *  a single recurring todo with rrule FREQ=WEEKLY
 *  this todo spans two days, from Jan 1 until Jan 2
 *
 *  Test requirement:
 *      on Jan 2 this todo must be visible.
 *      thats it.
 */
test("2-day todo is returned after its dtstart", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); //start of Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-02T15:59:59Z")); //end of Jan-2 in China
  const bounds = getTodayBoundaries(todo.timeZone);
  const occurences = generateTodosFromRRule([todo], todo.timeZone, bounds);
  const todoInstance = occurences[0];
  //expecting the previous todo to appear today too
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-31T16:00:00Z"));
  expect(occurences.length).toEqual(1);
});

/*
 *   scenario
 *  _____________________________________________________________________________________
 * |            Jan-1           |           Jan-2           |           Jan-3           |
 * |____________________________|___________________________|___________________________|
 * |  >>------------------------|-----------------------------------------------------> |
 * |            TODO            |                           |                     23:59 |
 * |    start:Jan1; due:Jan2    |           Today           |                           |
 * |    RRULE: FREQ=WEEKLY      |                           |                           |
 * |____________________________|___________________________|___________________________|
 *
 *  above scenario depicts the follwoing:
 *  a single recurring todo with rrule FREQ=WEEKLY
 *  this todo spans three days, from Jan 1 until Jan 3
 *
 *  Test requirement:
 *      on Jan 2 this todo must be visible.
 *      thats it.
 */
test("3-day todo is returned after its dtstart", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); // start of Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-03T15:59:59Z")); //Jan-3 in China
  const bounds = getTodayBoundaries(todo.timeZone);
  const occurences = generateTodosFromRRule([todo], todo.timeZone, bounds);
  const todoInstance = occurences[0];
  //expecting the previous todo to appear today too
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-31T16:00:00Z"));
  expect(occurences.length).toEqual(1);
});

/*
 *   scenario
 *  _____________________________________________________________________________________
 * |            Jan-1           |           Jan-2           |           Jan-3           |
 * |____________________________|___________________________|___________________________|
 * |  >>------------------------|-------------------------> |                           |
 * |            TODO            |                     23:59 |                           |
 * |    start:Jan1; due:Jan2    |                           |           Today           |
 * |    RRULE: FREQ=WEEKLY      |                           |                           |
 * |____________________________|___________________________|___________________________|
 *
 *  above scenario depicts the follwoing:
 *  a single recurring todo with rrule FREQ=WEEKLY
 *  this todo spans three days, from Jan 1 until Jan 2
 *
 *  Test requirement:
 *      on Jan 3 this todo must NOT be visible.
 *      thats it.
 */
test("2-day todo is not returned after its due", () => {
  const fixedTime = new Date("2026-01-02T16:00:00Z"); // Jan-3 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-02T15:59:99Z")); //Jan-2 in China
  const bounds = getTodayBoundaries(todo.timeZone);
  const occurences = generateTodosFromRRule([todo], todo.timeZone, bounds);
  //expecting the previous todo to appear today too
  expect(occurences.length).toEqual(0);
});
/*
 *   scenario
 *  _____________________________________________________________________________________
 * |            Jan-1           |           Jan-2           |           Jan-3           |
 * |____________________________|___________________________|___________________________|
 * |  >>------------------------|------------------>        |                           |
 * |            TODO            |                10:00      |                           |
 * |    start:Jan1; due:Jan2    |           Today           |                           |
 * |    RRULE: FREQ=WEEKLY      |                           |                           |
 * |____________________________|___________________________|___________________________|
 *
 *  above scenario depicts the follwoing:
 *  a single recurring todo with rrule FREQ=WEEKLY
 *  this todo spans two days, from Jan 1 until Jan 2
 *
 *  Test requirement:
 *      on Jan 2 this todo must be visible.
 *      thats it.
 */
test("odd hours 2-day todo is returned after its dtstart", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); //start of Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-02T10:00:00Z")); //end of Jan-2 in China
  const bounds = getTodayBoundaries(todo.timeZone);
  const occurences = generateTodosFromRRule([todo], todo.timeZone, bounds);
  const todoInstance = occurences[0];
  //expecting the previous todo to appear today too
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-31T16:00:00Z"));
  expect(occurences.length).toEqual(1);
});

/*
 * Ends exactly at today's start → should NOT be visible
 */
test("todo that ends exactly at todayStart is NOT returned", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); // beginning of Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);

  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-01T16:00:00Z")); // EXACTLY todayStartUTC

  const bounds = getTodayBoundaries(todo.timeZone);
  const occurrences = generateTodosFromRRule([todo], todo.timeZone, bounds);

  expect(occurrences.length).toEqual(0);
});

/*
 * EXDATE removes the spanning occurrence entirely (even if it would overlap today)
 */
test("exdated spanning todo is NOT returned even if it overlaps today", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); // Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);

  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z")) // Jan-1 in China
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-02T15:59:59Z")) // spans into today
    .withExdates([new Date("2025-12-31T16:00:00Z")]); // exdate the original start

  const bounds = getTodayBoundaries(todo.timeZone);
  const occurrences = generateTodosFromRRule([todo], todo.timeZone, bounds);

  // EXDATE should remove the logical occurrence; no ghost should be produced
  expect(occurrences.length).toEqual(0);
});

/*
 * Very long spanning todo (duration > 24h) should still be visible during intermediate days
 */
test("very long spanning todo (multiple days) is returned while it overlaps today", () => {
  const fixedTime = new Date("2026-01-01T16:00:00Z"); // Jan-2 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);

  // start Dec-31, due Jan-05 (spans many days) weekly rule
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-31T16:00:00Z"))
    .withRRule("FREQ=WEEKLY")
    .withdue(new Date("2026-01-05T15:59:59Z"));

  const bounds = getTodayBoundaries(todo.timeZone);
  const occurrences = generateTodosFromRRule([todo], todo.timeZone, bounds);

  expect(occurrences.length).toBeGreaterThan(0);
  // the single generated ghost should have the original dtstart
  expect(occurrences[0].dtstart).toEqual(new Date("2025-12-31T16:00:00Z"));
});
