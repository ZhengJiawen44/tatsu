import { test, expect } from "@jest/globals";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
import { TodoBuilder } from "../lib/todoBuilder";
import { overridingInstance, recurringTodoItemType } from "@/types";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

/**
 * server timezone is utc
 */

/**
 * given a single-day spanning todo, the closest upcoming should be returned
 */
test("correctly finds most recent occurrence for single day todo", () => {
  const timeZone = "Asia/Shanghai";
  const todayInChina = toZonedTime(
    fromZonedTime("2026-09-20T15:59:59", timeZone),
    timeZone,
  ); // sept-20 00:00 China

  //this todo has an occurences on sept-19 china time, and it ends on sept-20 01:00 china time
  const { todo } = new TodoBuilder()
    .withTitle("pinned daily")
    .withdtstart(fromZonedTime("2026-08-15T00:00:00", "Asia/Shanghai"))
    .withRRule("FREQ=WEEKLY")
    .withdue(fromZonedTime("2026-08-15T23:59:59", "Asia/Shanghai"))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const dateRangeEnd = fromZonedTime(todayInChina, timeZone);
  const closestInstance = getClosestOccuringInstance(
    recurringTodos,
    [],
    timeZone,
    dateRangeEnd,
    true,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2026-09-26T00:00:00", "Asia/Shanghai").toISOString(),
  );
});

/**
 * given a multi-day spanning todo, if the dateRangeEnd is within one of its occurences, that occurence should be returned
 */
test("correctly finds most recent occurrence for multi day todo", () => {
  const timeZone = "Asia/Shanghai";
  const todayInChina = toZonedTime(
    fromZonedTime("2026-09-20T01:00:00", timeZone),
    timeZone,
  ); // sept-20 00:00 China

  //this todo has an occurences on sept-19 china time, and it ends on sept-20 01:00 china time
  const { todo } = new TodoBuilder()
    .withTitle("pinned daily")
    .withdtstart(fromZonedTime("2026-08-15T00:00:00", "Asia/Shanghai"))
    .withRRule("FREQ=WEEKLY")
    .withdue(fromZonedTime("2026-08-16T01:00:00", "Asia/Shanghai"))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const dateRangeEnd = fromZonedTime(todayInChina, timeZone);
  const closestInstance = getClosestOccuringInstance(
    recurringTodos,
    [],
    timeZone,
    dateRangeEnd,
    true,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2026-09-19T00:00:00", "Asia/Shanghai").toISOString(),
  );
});

/**
 * given that the todo happened long before dateRangeEnd and UNTIL stops further
 * occurrences, the last occurrence should be returned
 */
test("returns last past occurrence when UNTIL stops the series before dateRangeEnd", () => {
  const timeZone = "Asia/Shanghai";
  const todayInChina = toZonedTime(
    fromZonedTime("2026-09-20T00:00:00", timeZone),
    timeZone,
  ); // sept-20 00:00 China

  // weekly from 2024-01-06 (Sat), last occurrence is 2024-05-25 — well before dateRangeEnd
  const { todo } = new TodoBuilder()
    .withTitle("stopped weekly")
    .withdtstart(fromZonedTime("2024-01-06T00:00:00", timeZone))
    .withRRule("FREQ=WEEKLY;UNTIL=20240525T000000")
    .withdue(fromZonedTime("2024-01-06T01:00:00", timeZone))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const dateRangeEnd = fromZonedTime(todayInChina, timeZone);
  const closestInstance = getClosestOccuringInstance(
    recurringTodos,
    [],
    timeZone,
    dateRangeEnd,
    true,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2024-05-25T00:00:00", timeZone).toISOString(),
  );
});

/**
 * given that the last occurrence of a long-finished series is completed,
 * the previous (next-last) occurrence should be returned
 */
test("returns previous occurrence when the last past occurrence is completed", () => {
  const timeZone = "Asia/Shanghai";
  const todayInChina = toZonedTime(
    fromZonedTime("2026-09-20T00:00:00", timeZone),
    timeZone,
  ); // sept-20 00:00 China

  // same series as above; last occ 2024-05-25 is completed → expect 2024-05-18
  const { todo } = new TodoBuilder()
    .withTitle("stopped weekly completed last")
    .withdtstart(fromZonedTime("2024-01-06T00:00:00", timeZone))
    .withRRule("FREQ=WEEKLY;UNTIL=20240525T000000")
    .withdue(fromZonedTime("2024-01-06T01:00:00", timeZone))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const lastOccurrence = fromZonedTime("2024-05-25T00:00:00", timeZone);
  const completedLast: overridingInstance = {
    id: "completed-last",
    completedAt: new Date("2024-05-25T12:00:00.000Z"),
    todoId: todo.id,
    recurId: lastOccurrence.toISOString(),
    instanceDate: lastOccurrence,
    overriddenTitle: null,
    overriddenDescription: null,
    overriddenDtstart: null,
    overriddenDue: null,
    overriddenDurationMinutes: null,
    overriddenPriority: null,
  };

  const dateRangeEnd = fromZonedTime(todayInChina, timeZone);
  const closestInstance = getClosestOccuringInstance(
    recurringTodos,
    [completedLast],
    timeZone,
    dateRangeEnd,
    true,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2024-05-18T00:00:00", timeZone).toISOString(),
  );
});
