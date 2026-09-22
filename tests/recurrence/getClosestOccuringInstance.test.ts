import { test, expect } from "@jest/globals";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
import { TodoBuilder } from "../lib/todoBuilder";
import { recurringTodoItemType } from "@/types";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";
import { endOfDay, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

/**
 * server timezone is utc
 */
const timeZone = "Asia/Shanghai";
const china = (local: string) => fromZonedTime(local, timeZone);

test("pinned todo with closest occurence as yesterday shows up in pinned results", () => {
    const today = fromZonedTime('2026-09-22T00:00:00', 'Asia/Shanghai');
    const { todo } = new TodoBuilder()
      .withTitle("pinned daily")
      .withdtstart(fromZonedTime('2026-02-09T00:00:00', 'Asia/Shanghai')) // aug-31 00:00 China
      .withRRule("FREQ=WEEKLY")
      .withdue(fromZonedTime('2026-02-09T01:00:00', 'Asia/Shanghai'))// aug-31 01:00  China
      .pinned();
    const recurringTodos = [todo as recurringTodoItemType]; 

    const timeZone = "Asia/Shanghai";
    const ghostTodos = expandAndMergeTodos(
      recurringTodos,
      timeZone,
      startOfDay(today),
      endOfDay(today),
    );

    expect(ghostTodos.length).toBe(33);
    const closestInstance = getClosestOccuringInstance(ghostTodos, new Date())
    expect(closestInstance.length).toBe(1);
    expect(closestInstance[0].dtstart.toISOString()).toBe(fromZonedTime('2026-09-21T00:00:00', 'Asia/Shanghai').toISOString());

});

test("pinned daily todo with an occurrence today returns today's instance", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo } = new TodoBuilder()
      .withTitle("pinned daily")
      .withdtstart(china("2026-08-31T00:00:00"))
      .withRRule("FREQ=DAILY")
      .withdue(china("2026-08-31T01:00:00"))
      .pinned();

    const ghostTodos = expandAndMergeTodos(
      [todo as recurringTodoItemType],
      timeZone,
      startOfDay(today),
      endOfDay(today),
    );
    const closestInstance = getClosestOccuringInstance(ghostTodos, today);

    expect(closestInstance).toHaveLength(1);
    expect(closestInstance[0].dtstart.toISOString()).toBe(
      china("2026-09-22T00:00:00").toISOString(),
    );
});

test("pinned weekly todo with closest occurrence two days ago returns that instance", () => {
    const today = china("2026-09-22T00:00:00"); // Tuesday
    const { todo } = new TodoBuilder()
      .withTitle("pinned weekly sunday")
      .withdtstart(china("2026-09-06T00:00:00")) // Sunday
      .withRRule("FREQ=WEEKLY")
      .withdue(china("2026-09-06T01:00:00"))
      .pinned();

    const ghostTodos = expandAndMergeTodos(
      [todo as recurringTodoItemType],
      timeZone,
      startOfDay(today),
      endOfDay(today),
    );
    const closestInstance = getClosestOccuringInstance(ghostTodos, today);

    expect(closestInstance).toHaveLength(1);
    expect(closestInstance[0].dtstart.toISOString()).toBe(
      china("2026-09-20T00:00:00").toISOString(),
    );
});

test("returns every incomplete instance due on or after dateRangeStart", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo } = new TodoBuilder()
      .withTitle("pinned daily")
      .withdtstart(china("2026-09-20T00:00:00"))
      .withRRule("FREQ=DAILY")
      .withdue(china("2026-09-20T01:00:00"))
      .pinned();

    const ghostTodos = expandAndMergeTodos(
      [todo as recurringTodoItemType],
      timeZone,
      startOfDay(today),
      endOfDay(china("2026-09-24T00:00:00")),
    );
    const closestInstance = getClosestOccuringInstance(ghostTodos, today);

    expect(closestInstance.map((instance) => instance.dtstart.toISOString())).toEqual([
      china("2026-09-22T00:00:00").toISOString(),
      china("2026-09-23T00:00:00").toISOString(),
      china("2026-09-24T00:00:00").toISOString(),
    ]);
});

test("skips completed instances and falls back to the last past incomplete one", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo } = new TodoBuilder()
      .withdtstart(china("2026-09-07T00:00:00"))
      .withRRule("FREQ=WEEKLY")
      .withdue(china("2026-09-07T01:00:00"))
      .pinned();

    const ghostTodos = expandAndMergeTodos(
      [todo as recurringTodoItemType],
      timeZone,
      startOfDay(today),
      endOfDay(today),
    ).map((ghost) =>
      ghost.dtstart.getTime() === china("2026-09-21T00:00:00").getTime()
        ? { ...ghost, completed: true }
        : ghost,
    );
    const closestInstance = getClosestOccuringInstance(ghostTodos, today);

    expect(closestInstance).toHaveLength(1);
    expect(closestInstance[0].dtstart.toISOString()).toBe(
      china("2026-09-14T00:00:00").toISOString(),
    );
});

test("returns one closest instance per master todo", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo: mondayTodo } = new TodoBuilder()
      .withTitle("monday")
      .withdtstart(china("2026-09-07T00:00:00"))
      .withRRule("FREQ=WEEKLY")
      .withdue(china("2026-09-07T01:00:00"))
      .pinned();
    const { todo: sundayTodo } = new TodoBuilder()
      .withTitle("sunday")
      .withdtstart(china("2026-09-06T00:00:00"))
      .withRRule("FREQ=WEEKLY")
      .withdue(china("2026-09-06T01:00:00"))
      .pinned();

    const ghostTodos = expandAndMergeTodos(
      [mondayTodo, sundayTodo] as recurringTodoItemType[],
      timeZone,
      startOfDay(today),
      endOfDay(today),
    );
    const closestInstance = getClosestOccuringInstance(ghostTodos, today);

    expect(
      closestInstance
        .map((instance) => instance.dtstart.toISOString())
        .sort(),
    ).toEqual([
      china("2026-09-20T00:00:00").toISOString(),
      china("2026-09-21T00:00:00").toISOString(),
    ]);
});

test("returns an empty list when there are no ghosts", () => {
    expect(getClosestOccuringInstance([], china("2026-09-22T00:00:00"))).toEqual([]);
});

test("returns an empty list when every instance is completed", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo } = new TodoBuilder()
      .withdtstart(china("2026-09-07T00:00:00"))
      .withRRule("FREQ=WEEKLY")
      .withdue(china("2026-09-07T01:00:00"))
      .pinned();
    const ghostTodos = expandAndMergeTodos(
      [todo as recurringTodoItemType],
      timeZone,
      startOfDay(today),
      endOfDay(today),
    ).map((ghost) => ({ ...ghost, completed: true }));

    expect(getClosestOccuringInstance(ghostTodos, today)).toEqual([]);
});

test("treats a missing due date as due on or after dateRangeStart", () => {
    const today = china("2026-09-22T00:00:00");
    const { todo } = new TodoBuilder()
      .withdtstart(china("2026-09-01T00:00:00"))
      .withRRule("FREQ=WEEKLY")
      .pinned();
    const ghostTodos: recurringTodoItemType[] = [
      {
        ...(todo as recurringTodoItemType),
        dtstart: china("2026-09-01T00:00:00"),
        due: null,
        instanceDate: china("2026-09-01T00:00:00"),
        completed: false,
      },
    ];

    const closestInstance = getClosestOccuringInstance(ghostTodos, today);
    expect(closestInstance).toHaveLength(1);
    expect(closestInstance[0].dtstart.toISOString()).toBe(
      china("2026-09-01T00:00:00").toISOString(),
    );
});

