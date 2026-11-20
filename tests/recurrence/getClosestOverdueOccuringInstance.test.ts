import { test, expect } from "@jest/globals";
import { getClosestOverdueOccuringInstance } from "@/lib/RRule/getClosestOverdueOccuringInstance";
import { TodoBuilder } from "../lib/todoBuilder";
import { overridingInstance, recurringTodoItemType } from "@/types";
import { fromZonedTime } from "date-fns-tz";

/**
 * server timezone is utc
 */

test("returns closest incomplete occurrence whose duration has ended", () => {
  const timeZone = "Asia/Shanghai";
  const dateRangeEnd = fromZonedTime("2026-09-20T12:00:00", timeZone);

  const { todo } = new TodoBuilder()
    .withTitle("weekly overdue")
    .withdtstart(fromZonedTime("2026-08-15T00:00:00", timeZone))
    .withRRule("FREQ=WEEKLY")
    .withdue(fromZonedTime("2026-08-15T23:59:59", timeZone))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  // last fully-ended weekly start before dateRangeEnd is 2026-09-19
  const closestInstance = getClosestOverdueOccuringInstance(
    recurringTodos,
    [],
    timeZone,
    dateRangeEnd,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2026-09-19T00:00:00", timeZone).toISOString(),
  );
});

test("skips completed closest overdue and returns the previous one", () => {
  const timeZone = "Asia/Shanghai";
  const dateRangeEnd = fromZonedTime("2026-09-20T12:00:00", timeZone);

  const { todo } = new TodoBuilder()
    .withTitle("weekly overdue completed")
    .withdtstart(fromZonedTime("2026-08-15T00:00:00", timeZone))
    .withRRule("FREQ=WEEKLY")
    .withdue(fromZonedTime("2026-08-15T23:59:59", timeZone))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const lastOverdue = fromZonedTime("2026-09-19T00:00:00", timeZone);
  const completed: overridingInstance = {
    id: "completed-overdue",
    completedAt: new Date("2026-09-19T12:00:00.000Z"),
    todoId: todo.id,
    recurId: lastOverdue.toISOString(),
    instanceDate: lastOverdue,
    overriddenTitle: null,
    overriddenDescription: null,
    overriddenDtstart: null,
    overriddenDue: null,
    overriddenDurationMinutes: null,
    overriddenPriority: null,
  };

  const closestInstance = getClosestOverdueOccuringInstance(
    recurringTodos,
    [completed],
    timeZone,
    dateRangeEnd,
  );
  expect(closestInstance?.toISOString()).toBe(
    fromZonedTime("2026-09-12T00:00:00", timeZone).toISOString(),
  );
});

test("returns undefined when an occurrence is still in progress", () => {
  const timeZone = "Asia/Shanghai";
  // mid multi-day window: start 09-19, due 09-20 01:00 — not yet overdue
  const dateRangeEnd = fromZonedTime("2026-09-20T00:30:00", timeZone);

  const { todo } = new TodoBuilder()
    .withTitle("multi-day in progress")
    .withdtstart(fromZonedTime("2026-09-19T00:00:00", timeZone))
    .withRRule("FREQ=WEEKLY;COUNT=1")
    .withdue(fromZonedTime("2026-09-20T01:00:00", timeZone))
    .pinned();
  const recurringTodos = todo as recurringTodoItemType;

  const closestInstance = getClosestOverdueOccuringInstance(
    recurringTodos,
    [],
    timeZone,
    dateRangeEnd,
  );
  expect(closestInstance).toBeUndefined();
});
