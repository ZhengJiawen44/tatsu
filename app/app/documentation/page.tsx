import React from "react";
export default function page() {
  return (
    <>
      <div className="mx-auto py-8 leading-relaxed">
        <h1 className="text-2xl font-semibold mb-3">
          RRULE Todo Scheduling System — Instance Semantics & Overrides
        </h1>
        <p className="mb-6  text-foreground brightness-75">
          This document defines the source of truth, data invariants, and
          instance-move semantics for the RRULE-based todo scheduling system. It
          follows RFC 5545 iCalendar behavior, adapted to this project’s schema
          and constraints.
        </p>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          1. Single Source of Truth
        </h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            The <InlineCode> Todo</InlineCode> table represents the recurrence
            definition (RRULE, DTSTART, duration, timezone).
          </li>
          <li>
            The <InlineCode>TodoInstance</InlineCode> table represents
            exceptions to the recurrence.
          </li>
          <li>
            The recurrence rule never mutates when a user edits a single
            occurrence.
          </li>
        </ul>
        <p className="mt-2 italic text-foreground brightness-75">
          If a change applies to only one occurrence, it is always represented
          as an exception.
        </p>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">2. Definitions</h2>
        <h3 className="text-lg font-semibold mt-4 mb-1">
          2.1 Generated &quot;Ghost&quot; Instance
        </h3>
        <p>
          A generated instance is a virtual occurrence produced by evaluating:
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <InlineCode>Todo.dtstart</InlineCode>
          </li>
          <li>
            <InlineCode>Todo.rrule</InlineCode>
          </li>
          <li>
            minus <InlineCode>Todo.exdates</InlineCode>
          </li>
        </ul>
        <p className="mt-2">Generated instances:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Do not exist in the database</li>
          <li>Are materialized only at runtime</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-1">
          2.2 Override Instance
        </h3>
        <p>
          A <InlineCode>TodoInstance</InlineCode> row represents a single
          overridden occurrence.
        </p>
        <table className="m-auto my-8 text-left" cellPadding={8}>
          <thead>
            <tr className="border-t-[1px]">
              <th>Field</th>
              <th>Type</th>
              <th>Description / Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t-[1px]">
              <td>id</td>
              <td>String</td>
              <td>cuid() - unique identifier for this instance</td>
            </tr>
            <tr className="border-t-[1px]">
              <td>todoId</td>
              <td>String</td>
              <td>Reference to parent Todo</td>
            </tr>
            <tr className="border-t-[1px]">
              <td>recurId</td>
              <td>String</td>
              <td>
                identifies which original RRULE occurrence this override belongs
                to
              </td>
            </tr>
            <tr className="border-y-[1px]">
              <td>overriddenDtstart</td>
              <td>DateTime?</td>
              <td>Changed start time for this occurrence</td>
            </tr>
          </tbody>
        </table>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            This override instance matches a specific recurrence occurrence via
            its <InlineCode>recurrenceId</InlineCode> or{" "}
            <InlineCode>overridenDtstart</InlineCode>
          </li>
          <li>
            May override title, description, time, duration, priority, or
            completion state
          </li>
        </ul>
        <h3 className="text-lg font-semibold mt-4 mb-1">
          2.3 Cancelled Occurrence (EXDATE)
        </h3>
        <p>An EXDATE removes a single occurrence from the recurrence set.</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            EXDATEs are stored on <InlineCode>Todo.exdates</InlineCode>
          </li>
          <li>EXDATE means: “this occurrence no longer exists”</li>
        </ul>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          3. Rendering Algorithm (Read Path)
        </h2>
        <ol className="list-decimal ml-5 space-y-1">
          <li>
            Generate a list of occurrence dates using{" "}
            <InlineCode>rruleSet.between(rangeStart, rangeEnd)</InlineCode> with
            look-behind for multi day spanning todos.
            <p className=" italic text-foreground brightness-75">
              look-behind captures todos that started in the past and are still
              ongoing in the present.
            </p>
          </li>
          <li>
            for each occurence dates generate a ghost todo by copying their
            values from the parent todo.
            <p className=" italic text-foreground brightness-75">
              each generated todo have their dtstart changed to the generated
              occurence date. This dtstart is different than the dtstart in the
              todo table
            </p>
          </li>
          <li>
            ghost todos are evaluated and overriden when its dtstart/occurence
            date matched with an override instance&apos;{" "}
            <InlineCode>recurrenceID</InlineCode> first
          </li>
          <li>
            overriden todos are evaluated and overriden when its
            dtstart/occurence date matched with an override instance&apos;{" "}
            <InlineCode>dtstart</InlineCode> first
          </li>
        </ol>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          4. Instance Move Semantics
        </h2>
        <p>Moving a single occurrence is modeled as:</p>
        <p className="font-medium">
          Exdate the original occurrence and ensure exactly one occurrence
          exists at the moved-to dtstart.
        </p>
        <p>
          The implementation differs based on whether the moved-to dtstart is
          generated by the RRULE.
        </p>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          5. Case A — Move to a Date Generated by RRULE
        </h2>
        <p className="font-medium">Example:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            RRULE: <InlineCode>FREQ=WEEKLY;BYDAY=MO</InlineCode>
          </li>
          <li>Original: Mon Jan 1</li>
          <li>Moved → Mon Jan 8</li>
        </ul>
        <p className="font-medium mt-2">Required actions:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>
            Add original date to <InlineCode>Todo.exdates</InlineCode>
          </li>
          <li>
            Update or create a <InlineCode>TodoInstance</InlineCode> for the
            target date
          </li>
        </ol>
        <pre className="bg-black text-white rounded p-8 my-3 text-sm overflow-x-auto">
          Todo.exdates += [2026-01-01]
        </pre>
        <pre className="bg-black text-white rounded p-8 my-3 text-sm overflow-x-auto">
          <code>
            {`Todo.TodoInstance += {todoId, overriddenDtstart:2026-01-08T...}`}
          </code>
        </pre>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          6. Case B — Move to a Date Not Generated by RRULE
        </h2>
        <p className="font-medium">Example:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>RRULE: weekly Monday</li>
          <li>Original: Mon Jan 1</li>
          <li>Moved → Tue Jan 2</li>
        </ul>
        <p className="font-medium mt-2">Required actions:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>
            Create a new <InlineCode>TodoInstance</InlineCode> for the moved-to
            date
          </li>
        </ol>
        <pre className="bg-black text-white rounded p-8 my-3 text-sm overflow-x-auto">
          <code>
            {`Todo.TodoInstance += {todoId, overriddenDtstart:2026-01-02T...}`}
          </code>
        </pre>
        <p className="mt-2">
          <strong>Key insight:</strong> EXDATE only when moved-to date falls on
          a occurence date.
        </p>
        <hr className="my-6" />
        <h2 className="text-base font-semibold mt-6 mb-2">
          8. Completion Semantics
        </h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Completion state is stored per instance</li>
          <li>
            Completing a generated instance creates a{" "}
            <InlineCode>TodoInstance</InlineCode> row
          </li>
          <li>Completion does not mutate the recurrence rule</li>
        </ul>
        <hr className="my-6" />
      </div>
    </>
  );
}
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono bg-popover-accent px-1 rounded">{children}</code>
  );
}
