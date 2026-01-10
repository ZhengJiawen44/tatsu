import { TodoItemType } from "@/types";

export class TodoBuilder {
  public todo: TodoItemType;

  constructor() {
    this.todo = {
      id: crypto.randomUUID(),
      title: "",
      description: null,
      pinned: false,
      createdAt: new Date(),
      order: 0,
      priority: "Low",
      dtstart: new Date(),
      durationMinutes: 30,
      rrule: "",
      timeZone: "Asia/Shanghai",
      userID: crypto.randomUUID(),
      due: new Date(),
      completed: false,
      exdates: [],
    };
  }

  withTitle(title: string): this {
    this.todo.title = title;
    return this;
  }

  withRRule(rrule: string): this {
    this.todo.rrule = rrule;
    return this;
  }

  withdtstart(dtstart: Date): this {
    this.todo.dtstart = dtstart;
    return this;
  }
  withdue(due: Date): this {
    this.todo.due = due;
    return this;
  }

  withPriority(priority: "Low" | "Medium" | "High"): this {
    this.todo.priority = priority;
    return this;
  }

  withTimeZone(timeZone: string): this {
    this.todo.timeZone = timeZone;
    return this;
  }
  withExdates(exDates: Date[]) {
    this.todo.exdates.push(...exDates);
    return this;
  }

  pinned(): this {
    this.todo.pinned = true;
    return this;
  }

  build(): TodoItemType {
    return { ...this.todo };
  }
}
