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
