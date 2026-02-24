import { recurringTodoItemType } from "@/types";
import getTodayBoundaries from "../lib/getTodayBoundaries";
import { TodoBuilder } from "../lib/todoBuilder";
import generateTodosFromRRule from "@/lib/RRule/generateTodosFromRRule";

/**
 * These tests assume user is in China and the server uses UTC as its timezone.
 * these tests test {generateTodosFromRRule}, which is time zone aware.
 * Calculations are done in user's time zone and returned in UTC format
 */

test("daily repeat generates a correct todo", () => {
  const fixedTime = new Date("2025-10-12T17:00:00Z"); // Oct-13-01:00 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-10-10T16:00:00Z")) // Oct-11-00:00 in China
    .withRRule("FREQ=DAILY")
    .withdue(new Date("2025-10-10T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  //expecting an instance to be generated with dtStart at Oct-13-00:00 in China
  expect(todoInstance.dtstart).toEqual(new Date("2025-10-12T16:00:00.000Z"));
});

test("weekly repeat on Tuesdays generates the correct todo", () => {
  const fixedTime = new Date("2025-12-08T17:00:00Z"); // Dec-09 Tu in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-01T16:00:00Z")) // Dec-02 Tu in china
    .withRRule("FREQ=WEEKLY;BYDAY=TU")
    .withdue(new Date("2025-12-01T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];
  //expecting an instance to be generated with dtStart at Dec-09 China
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-08T16:00:00.000Z"));
});

test("weekly repeat on Tuesdays and Thursdays generates the correct todo", () => {
  const fixedTime = new Date("2025-12-08T17:00:00Z"); // Dec-09 Tu in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-01T16:00:00Z")) // Dec-02 Tu in china
    .withRRule("FREQ=WEEKLY;BYDAY=TU,TH")
    .withdue(new Date("2025-12-01T20:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  bounds.dateRangeStart = new Date("2025-12-10T16:00:00Z"); // Dec-11 Th in china
  const todoInstances = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  );
  //expecting 2 instance to be generated with dtStart at Dec-09 Tu China and Dec-11 Th China
  expect(todoInstances.map(({ dtstart }) => dtstart)).toEqual([
    new Date("2025-12-08T16:00:00.000Z"),
    new Date("2025-12-10T16:00:00.000Z"),
  ]);
});

test("daily repeat at midnight boundary generates correct todo instance", () => {
  const fixedTime = new Date("2025-10-13T16:00:00Z"); // Oct-14-00:00 in China (exactly midnight)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-10-11T16:00:00Z")) // Oct-12-00:00 in China
    .withRRule("FREQ=DAILY;WKST=MO")
    .withdue(new Date("2025-10-11T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Oct-14-00:00 in China
  expect(todoInstance.dtstart).toEqual(new Date("2025-10-13T16:00:00.000Z"));
});

test("daily repeat one second before midnight generates correct todo", () => {
  const fixedTime = new Date("2025-10-13T15:59:59Z"); // Oct-13-23:59:59 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-10-11T16:00:00Z")) // Oct-12-00:00 in China
    .withRRule("FREQ=DAILY;WKST=MO")
    .withdue(new Date("2025-10-11T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Oct-13-00:00 in China (today's instance)
  expect(todoInstance.dtstart).toEqual(new Date("2025-10-12T16:00:00.000Z"));
});

test("daily repeat one second after midnight generates correct todo", () => {
  const fixedTime = new Date("2025-10-13T16:00:01Z"); // Oct-14-00:00:01 in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-10-11T16:00:00Z")) // Oct-12-00:00 in China
    .withRRule("FREQ=DAILY;WKST=MO")
    .withdue(new Date("2025-10-11T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Oct-14-00:00 in China (today's instance)
  expect(todoInstance.dtstart).toEqual(new Date("2025-10-13T16:00:00.000Z"));
});

test("every January on Satuday generates and correct occurrence", () => {
  const fixedTime = new Date("2025-01-24T17:00:00Z"); // Jan-25-01:00 Sat in China
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-01-17T16:00:00Z")) // Jan-18-00:00 Sat in China
    .withRRule("FREQ=MONTHLY;COUNT=30;WKST=MO;BYDAY=SA;BYMONTH=1")
    .withdue(new Date("2025-01-17T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Jan-25-00:00 in China (today's instance)
  expect(todoInstance.dtstart).toEqual(new Date("2025-01-24T16:00:00.000Z"));
});

// COUNT and UNTIL limits
// Daily repeat with COUNT=3 (should stop after 3 occurrences)
// Weekly repeat with UNTIL date set to 2 weeks from now
// Verify no todos generated when all occurrences are exhausted
test("daily repeat with count=3 generates correct todo on day 2", () => {
  const fixedTime = new Date("2025-01-13T17:00:00Z"); // Jan-14-01:00 in China (day 2)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-01-12T16:00:00Z")) // Jan-13-00:00 in China
    .withRRule("FREQ=DAILY;COUNT=3;WKST=MO")
    .withdue(new Date("2025-01-12T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Jan-14-00:00 in China
  expect(todoInstance.dtstart).toEqual(new Date("2025-01-13T16:00:00.000Z"));
});

test("daily repeat with count=3 generates no todo after count exhausted", () => {
  const fixedTime = new Date("2025-01-15T17:00:00Z"); // Jan-16-01:00 in China (day 4, after count)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-01-12T16:00:00Z")) // Jan-13-00:00 in China
    .withRRule("FREQ=DAILY;COUNT=3;WKST=MO")
    .withdue(new Date("2025-01-12T17:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstances = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  );

  // Expecting no instances since count is exhausted (only 3 occurrences: Jan-13, Jan-14, Jan-15)
  expect(todoInstances.length).toEqual(0);
});

test("weekly repeat with until generates correct todo on week 3", () => {
  const fixedTime = new Date("2025-12-15T17:00:00Z"); // Dec-16-01:00 Tu in China (week 3)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-01T17:00:00Z")) // Dec-02-01:00 Tu in China
    .withRRule("FREQ=WEEKLY;UNTIL=20251230T020000;WKST=MO")
    .withdue(new Date("2025-12-01T18:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Dec-16-01:00 in China
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-15T17:00:00.000Z"));
});

test("weekly repeat with until generates correct todo on last occurrence", () => {
  const fixedTime = new Date("2025-12-29T17:00:00Z"); // Dec-30-01:00 Tu in China (last occurrence)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-01T17:00:00Z")) // Dec-02-01:00 Tu in China
    .withRRule("FREQ=WEEKLY;UNTIL=20251230T020000;WKST=MO")
    .withdue(new Date("2025-12-01T18:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstance = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  )[0];

  // Expecting an instance to be generated with dtStart at Dec-30-01:00 in China (last valid occurrence)
  expect(todoInstance.dtstart).toEqual(new Date("2025-12-29T17:00:00.000Z"));
});

test("weekly repeat with until generates no todo after until date", () => {
  const fixedTime = new Date("2026-01-05T17:00:00Z"); // Jan-06-01:00 Tu in China (after until)
  jest.useFakeTimers();
  jest.setSystemTime(fixedTime);
  const { todo } = new TodoBuilder()
    .withdtstart(new Date("2025-12-01T17:00:00Z")) // Dec-02-01:00 Tu in China
    .withRRule("FREQ=WEEKLY;UNTIL=20251230T020000;WKST=MO")
    .withdue(new Date("2025-12-01T18:00:00Z"));
  const bounds = getTodayBoundaries(todo.timeZone);
  const todoInstances = generateTodosFromRRule(
    [todo as recurringTodoItemType],
    todo.timeZone,
    bounds,
  );

  // Expecting no instances since until date has passed
  expect(todoInstances.length).toEqual(0);
});
