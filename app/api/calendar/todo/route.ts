import { NextRequest, NextResponse } from "next/server";
// import { Priority } from "@prisma/client";
import {
  BadRequestError,
  // BaseServerError,
  UnauthorizedError,
  // BadRequestError,
  // InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
// import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { errorHandler } from "@/lib/errorHandler";
import { overrideBy } from "@/lib/overrideBy";
import { CalendarTodoItemType, recurringTodoWithInstance } from "@/types";
import { mergeInstanceAndTodo } from "@/lib/mergeInstanceAndTodo";
// import { mergeInstanceAndTodo } from "@/lib/mergeInstanceAndTodo";

// export async function POST(req: NextRequest) {
//   try {
//     //throw new Error("expected error happened");
//     const session = await auth();
//     const user = session?.user;

//     if (!user?.id)
//       throw new UnauthorizedError("you must be logged in to do this");

//     //validate req body
//     let body = await req.json();

//     body = {
//       ...body,
//       dtstart: new Date(body.dtstart),
//       due: new Date(body.due),
//     };

//     const parsedObj = todoSchema.safeParse(body);
//     if (!parsedObj.success) throw new BadRequestError();

//     const { title, description, priority, dtstart, due, rrule } =
//       parsedObj.data;
//     //create todo
//     const todo = await prisma.todo.create({
//       data: {
//         userID: user.id,
//         title,
//         description,
//         priority: priority as Priority,
//         dtstart,
//         due,
//         rrule,
//       },
//     });
//     if (!todo) throw new InternalError("todo cannot be created at this time");
//     // console.log(todo);

//     return NextResponse.json(
//       { message: "todo created", todo },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.log(error);

//     //handle custom error
//     if (error instanceof BaseServerError) {
//       return NextResponse.json(
//         { message: error.message },
//         { status: error.status },
//       );
//     }

//     //handle generic error
//     return NextResponse.json(
//       {
//         message:
//           error instanceof Error
//             ? error.message.slice(0, 50)
//             : "an unexpected error occured",
//       },
//       { status: 500 },
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const timeZone = await resolveTimezone(user, req);
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    if (!start || !end)
      throw new BadRequestError("date range start or from not specified");
    const dateRangeStart = new Date(Number(start));
    const dateRangeEnd = new Date(Number(end));

    // Fetch One-Off Todos scheduled for today
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        completed: false,
        due: {
          gte: dateRangeStart,
        },
        dtstart: {
          lte: dateRangeEnd,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all Recurring todos that have already started
    const recurringParents = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        dtstart: { lte: dateRangeEnd },
        completed: false,
      },
      include: { instances: true },
    })) as recurringTodoWithInstance[];

    // Expand RRULEs to generate occurrences happening "Today"
    const ghostTodos = generateTodosFromRRule(recurringParents, timeZone, {
      dateRangeStart,
      dateRangeEnd,
    });

    // // Apply overrides
    const mergedUsingRecurrId = overrideBy(ghostTodos, (inst) => inst.recurId);

    //find out of range overrides
    const movedTodos = getMovedInstances(
      mergedUsingRecurrId,
      recurringParents,
      { dateRangeStart, dateRangeEnd },
    );

    const allGhosts = [...mergedUsingRecurrId, ...movedTodos].filter((todo) => {
      return todo.due >= dateRangeStart && todo.completed === false;
    });
    // console.log("one off todos: : ", oneOffTodos);
    // console.log("recurring parents : ", recurringParents);
    console.log("ghost: ", ghostTodos);
    console.log("merged with reccur ID: ", mergedUsingRecurrId);
    console.log("moved todos: ", movedTodos);
    console.log(
      "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    );
    const allTodos = [...oneOffTodos, ...allGhosts].sort(
      (a, b) => a.order - b.order,
    );

    return NextResponse.json({ todos: allTodos }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

// /**
//  * @description generated "orphaned todos" by finding instances that had their dtstart overriden to another time
//  * @param mergedTodos a list of todos that are used to check for duplicates
//  * @param recurringParents a list of todos that has all the instances
//  * @param bounds a { dateRangeStart: Date; dateRangeEnd: Date } object
//  * @returns a list of orphaned todos
//  */
function getMovedInstances(
  mergedTodos: CalendarTodoItemType[],
  recurringParents: CalendarTodoItemType[],
  bounds: { dateRangeStart: Date; dateRangeEnd: Date },
): CalendarTodoItemType[] {
  const mergedDtstarts = mergedTodos.map(
    (merged) => merged.dtstart.getTime() + " " + merged.instanceDate?.getTime(),
  );
  const orphanedInstances = recurringParents.flatMap(
    (todo: CalendarTodoItemType) => {
      if (!todo.instances) return [];

      return todo.instances.filter(
        ({ overriddenDtstart, overriddenDue, instanceDate }) => {
          return (
            overriddenDtstart &&
            overriddenDue &&
            !todo.exdates.includes(overriddenDtstart) &&
            //need to have started and crosses in to the current range
            overriddenDtstart <= bounds.dateRangeEnd &&
            overriddenDue >= bounds.dateRangeStart &&
            !mergedDtstarts.includes(
              overriddenDtstart.getTime() + " " + instanceDate.getTime(),
            )
          );
        },
      );
    },
  );

  const orphanedTodos = orphanedInstances.flatMap((instance) => {
    const parentTodo = recurringParents.find(
      (parent) => parent.id === instance.todoId,
    );
    if (parentTodo) return mergeInstanceAndTodo(instance, parentTodo);
    return [];
  });
  return orphanedTodos;
}
