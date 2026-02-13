"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Prism from "prismjs";
// import "prismjs/components/prism-typescript";
import "prism-themes/themes/prism-coldark-dark.css";
import { cn } from "@/lib/utils";

export default function Page() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <div className="py-10 overflow-y-auto">
        <div className="relative w-full h-[100px] md:h-[150px] lg:h-[200px]  rounded-lg overflow-hidden mb-8">
          <Image
            src={"/coffee.jpg"}
            fill
            alt="instance date drifting header"
            priority
            className="object-cover object-bottom"
            sizes="100vw"
          />
        </div>
        <TableOfContents className="xl:hidden" />
        <section id="overview">
          <h3 className=" font-semibold mb-3">
            Instance date drifting problem
          </h3>
          <p className="mb-6 text-foreground brightness-75">
            <InlineCode>instanceDate</InlineCode> is the occurrence date of a
            naturally generated todo. It is a crucial piece of information used
            to connect together the todo overrides with its generated instances.
          </p>
        </section>

        <hr className="my-6" />

        <section id="the-problem">
          <h2 className="text-base font-semibold mt-6 mb-2">1. The Problem</h2>
          <p className="mb-4">
            <InlineCode>instanceDate</InlineCode> plays a vital part in the
            lifecycle of a generated recurring todo. Every generated todo has an
            instance date, and although it is not persisted to the database
            unless an overriding instance is created, it is used in many of the
            Patch/Delete/Get routes and sometimes even used to uniquely identify
            instances, like in the case of optimistically updating recurrent
            todos.
          </p>
          <p className="mb-4">
            <InlineCode>instanceDate</InlineCode> is only persisted when a todo
            override is created in the database, in which case it serves to
            identify the correct occurrence to override.
          </p>
          <p className="mb-4">
            However, due to the static nature of{" "}
            <InlineCode>instanceDate</InlineCode>, any changes to the rrule or
            original dtstart may cause it to reference a non-existent occurrence
            due to the moved sequence.
          </p>
          <p className="mb-4">
            Take this example below: a recurring weekly todo that starts from
            Jan 13
          </p>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/drifting_instanceDateExample1.png"}
            width={900}
            height={300}
            alt="example of weekly recurring todo"
            loading="lazy"
          />
          <p className="mb-4">
            The todo on Jan 20 is moved to the day before it, and an overriding
            instance was upserted in the database for it.
          </p>
          <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm">
            <code>
              {` overridingInstance = {
    todoId: 123,
    instanceDate: "2026-01-20T00:00:00.000Z",        // Original Tuesday occurrence
    recurId: "2026-01-20T00:00:00.000Z",        // same as instanceDate, but converted to String
    overriddenDtstart: "2026-01-19T20:00:00.000Z", // moved-to dtstart date
    overriddenDue: "2026-01-19T23:59:59.999Z",
    ...
  }
  await prisma.todoInstance.upsert({where:id, data: overridingInstance})`}
            </code>
          </pre>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/drifting_instanceDateExample2.png"}
            width={900}
            height={300}
            alt="example of moved weekly recurring todo"
            loading="lazy"
          />
          <p className="mb-4">
            The user then edits one of the other todos, and sets the dtstart to
            be Jan 14, effectively moving the whole sequence by one day.
          </p>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/drifting_instanceDateExample3.png"}
            width={900}
            height={300}
            alt="example of weekly recurring todo with changed dtstart"
            loading="lazy"
          />
          <p className="mb-4">
            A dialog appears which asks whether or not the change should be
            applied to every occurrence or only this instance. The former is
            selected.
          </p>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/drifting_instanceDateExample4.png"}
            width={900}
            height={300}
            alt="dialog for applying changes"
            loading="lazy"
          />
          <p className="mb-4">So now these fields are in the database:</p>
          <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm">
            <code>
              {` todo {
    id:123
    dtstart: "2026-01-14T00:00:00.000Z",        // dtstart of this recurrent todo
    due: "2026-01-14T23:59:59.999Z",
    title: "do laundry 122",
    description: "",
    ...
  }
  overridingInstance {
    todoId:123
    instanceDate: "2026-01-20T00:00:00.000Z",        // Original Tuesday occurrence
    recurId: "2026-01-20T00:00:00.000Z",        // same as instanceDate, but converted to String
    overriddenDtstart: "2026-01-19T20:00:00.000Z", // moved-to dtstart date
    overriddenDue: "2026-01-19T23:59:59.999Z",
    ...
  }
  `}
            </code>
          </pre>
          <p className="mb-4">
            The todos are fetched, and you would expect this to be the output:
          </p>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/expectedExample.png"}
            width={900}
            height={300}
            alt="expected result after sequence change"
            loading="lazy"
          />
          <p className="mb-4">
            But this is what you see: a todo on Jan 14, 21, 28 and a duplicate
            todo on Jan 19 (the old overriding instance).
          </p>
          <Image
            className=" border-transparent rounded-lg m-auto my-8"
            src={"/drifting_instanceDateExample5.png"}
            width={900}
            height={300}
            alt="actual result showing duplicate"
            loading="lazy"
          />
          <p className="mb-4">
            The cause for this is very simple: since the overriding instance was
            pointing to Jan 20 with its <InlineCode>instanceDate</InlineCode>,
            but later when the recurrence rule was changed, it shifted the whole
            sequence to start from another date, the{" "}
            <InlineCode>instanceDate</InlineCode> now points to a non-existent
            occurrence in the sequence. This causes the duplicate manifestation
            of the instance on Jan 21 as it was not overridden correctly due to
            the mismatching instance date.
          </p>
        </section>

        <hr className="my-6" />

        <section id="root-cause">
          <h2 className="text-base font-semibold mt-6 mb-2">
            2. Root Cause Analysis
          </h2>

          <section id="static-reference">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              2.1 Static Instance Date Reference
            </h3>
            <p className="mb-4">
              The fundamental issue is that{" "}
              <InlineCode>instanceDate</InlineCode> is a static timestamp that
              references a specific point in time. When you create an override,
              it says: &quot;This override applies to the occurrence that
              happens on Jan 20.&quot;
            </p>
            <ul className="list-disc ml-5 space-y-2 mb-4">
              <li>
                <InlineCode>instanceDate</InlineCode> is calculated once when
                the override is created
              </li>
              <li>
                It remains unchanged even when the parent todo&apos;s recurrence
                rule changes
              </li>
              <li>
                There is no mechanism to update existing{" "}
                <InlineCode>instanceDate</InlineCode> values when the sequence
                shifts
              </li>
            </ul>
          </section>

          <section id="sequence-dependency">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              2.2 Sequence Dependency
            </h3>
            <p className="mb-4">
              The <InlineCode>instanceDate</InlineCode> is fundamentally tied to
              the recurrence sequence, which is determined by:
            </p>
            <ul className="list-disc ml-5 space-y-2 mb-4">
              <li>
                <InlineCode>Todo.dtstart</InlineCode> - the starting point of
                the sequence
              </li>
              <li>
                <InlineCode>Todo.rrule</InlineCode> - the recurrence pattern
                (daily, weekly, etc.)
              </li>
              <li>
                <InlineCode>Todo.exdates</InlineCode> - exceptions to the
                sequence
              </li>
            </ul>
            <p className="mb-4">
              When any of these change, the entire sequence can shift, but
              existing overrides still reference dates from the old sequence.
            </p>
          </section>

          <section id="matching-failure">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              2.3 Override Matching Failure
            </h3>
            <p className="mb-4">
              The rendering algorithm attempts to match overrides to generated
              instances by comparing <InlineCode>instanceDate</InlineCode> with
              the occurrence dates:
            </p>
            <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm mb-4">
              <code>
                {`// Pseudocode for matching logic
generatedInstances.forEach(instance => {
  const override = overrides.find(o => 
    o.instanceDate === instance.dtstart
  );
  if (override) {
    applyOverride(instance, override);
  }
});`}
              </code>
            </pre>
            <p className="mb-4">
              When the sequence shifts, this matching fails because:
            </p>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                The override&apos;s <InlineCode>instanceDate</InlineCode> points
                to Jan 20 (old sequence)
              </li>
              <li>
                The new sequence generates instances for Jan 14, 21, 28 (new
                sequence)
              </li>
              <li>
                No match is found, so both the unmatched override and the new
                instance appear
              </li>
            </ul>
          </section>
        </section>

        <hr className="my-6" />

        <section id="impact">
          <h2 className="text-base font-semibold mt-6 mb-2">
            3. Impact and Edge Cases
          </h2>

          <section id="user-visible-impact">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              3.1 User-Visible Impact
            </h3>
            <ul className="list-disc ml-5 space-y-2 mb-4">
              <li>
                <strong>Duplicate todos:</strong> Users see both the orphaned
                override and the new instance
              </li>
              <li>
                <strong>Lost overrides:</strong> Custom titles, descriptions, or
                completion states from the override don&apos;t apply to the new
                instance
              </li>
              <li>
                <strong>Confusion:</strong> Users may not understand why their
                moved todo appears in the wrong place or why there are
                duplicates
              </li>
            </ul>
          </section>

          <section id="data-integrity">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              3.2 Data Integrity Issues
            </h3>
            <ul className="list-disc ml-5 space-y-2 mb-4">
              <li>
                Orphaned overrides accumulate in the database with no valid
                parent occurrence
              </li>
              <li>
                The relationship between overrides and their parent sequence
                becomes inconsistent
              </li>
              <li>
                Clean-up operations become necessary to remove invalid overrides
              </li>
            </ul>
          </section>

          <section id="edge-cases">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              3.3 Common Edge Cases
            </h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>
                <strong>Frequency change:</strong> Weekly → daily creates many
                more occurrences, potentially matching overrides to wrong
                instances
              </li>
              <li>
                <strong>Timezone changes:</strong> Can shift instance dates by
                hours or days
              </li>
              <li>
                <strong>Multiple overrides:</strong> Several overrides can
                become orphaned simultaneously
              </li>
              <li>
                <strong>Moved then deleted:</strong> If a moved instance&apos;s
                new date is later exdated, it creates a ghost override
              </li>
            </ul>
          </section>
        </section>

        <hr className="my-6" />

        <section id="potential-solutions">
          <h2 className="text-base font-semibold mt-6 mb-2">
            4. Potential Solutions
          </h2>

          <section id="solution-recalculation">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              4.1 Recalculate Instance Dates on Rule Change
            </h3>
            <p className="mb-4">
              When the parent todo&apos;s recurrence rule or dtstart changes,
              recalculate all override <InlineCode>instanceDate</InlineCode>{" "}
              values to match the new sequence.
            </p>
            <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm mb-4">
              <code>
                {`async function updateRecurrenceRule(todoId: string, newRrule: string, newDtstart: Date) {
  // Get old sequence
  const oldSequence = generateOccurrences(todo.rrule, todo.dtstart);
  
  // Update parent todo
  await prisma.todo.update({
    where: { id: todoId },
    data: { rrule: newRrule, dtstart: newDtstart }
  });
  
  // Get new sequence
  const newSequence = generateOccurrences(newRrule, newDtstart);
  
  // Update all overrides
  const overrides = await prisma.todoInstance.findMany({ 
    where: { todoId } 
  });
  
  for (const override of overrides) {
    const oldIndex = oldSequence.findIndex(d => d === override.instanceDate);
    if (oldIndex >= 0 && newSequence[oldIndex]) {
      await prisma.todoInstance.update({
        where: { id: override.id },
        data: { 
          instanceDate: newSequence[oldIndex],
          recurId: newSequence[oldIndex].toISOString()
        }
      });
    }
  }
}`}
              </code>
            </pre>
            <p className="mb-4 font-medium">Pros:</p>
            <ul className="list-disc ml-5 space-y-1 mb-4">
              <li>
                Maintains the relationship between overrides and their parent
                sequence
              </li>
              <li>No orphaned overrides</li>
              <li>
                User intent is preserved (the 2nd occurrence stays the 2nd
                occurrence)
              </li>
            </ul>
            <p className="mb-4 font-medium">Cons:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Complex to implement correctly</li>
              <li>
                May not handle all edge cases (frequency changes, removed
                occurrences)
              </li>
              <li>Performance impact on todos with many overrides</li>
            </ul>
          </section>

          <section id="solution-position-based">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              4.2 Position-Based References
            </h3>
            <p className="mb-4">
              Instead of storing absolute dates, store the position of the
              occurrence in the sequence (e.g., &quot;the 3rd occurrence&quot;).
            </p>
            <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm mb-4">
              <code>
                {`interface TodoInstance {
  id: string;
  todoId: string;
  occurrenceIndex: number;  // Position in sequence (0, 1, 2, ...)
  overriddenDtstart?: Date;
  overriddenTitle?: string;
  // ...
}`}
              </code>
            </pre>
            <p className="mb-4 font-medium">Pros:</p>
            <ul className="list-disc ml-5 space-y-1 mb-4">
              <li>Naturally adapts to sequence changes</li>
              <li>Clear semantic meaning</li>
              <li>No recalculation needed</li>
            </ul>
            <p className="mb-4 font-medium">Cons:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Major schema change required</li>
              <li>Migration complexity for existing data</li>
              <li>
                Still has issues with frequency changes (daily→weekly loses
                occurrences)
              </li>
            </ul>
          </section>

          <section id="solution-cleanup">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              4.3 Automatic Orphan Cleanup
            </h3>
            <p className="mb-4">
              Detect and remove orphaned overrides during rendering or via
              background job.
            </p>
            <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm mb-4">
              <code>
                {`async function cleanupOrphanedOverrides(todoId: string) {
  const todo = await prisma.todo.findUnique({ where: { id: todoId } });
  const validOccurrences = generateOccurrences(todo.rrule, todo.dtstart);
  const overrides = await prisma.todoInstance.findMany({ 
    where: { todoId } 
  });
  
  const orphaned = overrides.filter(override => 
    !validOccurrences.some(occ => 
      occ.getTime() === override.instanceDate.getTime()
    )
  );
  
  await prisma.todoInstance.deleteMany({
    where: { id: { in: orphaned.map(o => o.id) } }
  });
}`}
              </code>
            </pre>
            <p className="mb-4 font-medium">Pros:</p>
            <ul className="list-disc ml-5 space-y-1 mb-4">
              <li>Simple to implement</li>
              <li>Prevents accumulation of bad data</li>
              <li>Can run as background maintenance</li>
            </ul>
            <p className="mb-4 font-medium">Cons:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>User customizations are lost permanently</li>
              <li>Doesn&apos;t solve the fundamental design issue</li>
              <li>May surprise users when their changes disappear</li>
            </ul>
          </section>

          <section id="solution-remove">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              4.4 Removal Approach
            </h3>
            <p className="mb-4">
              Remove all overriding instances for the edited todo when the
              recurrence rule or dtstart changes.
            </p>
            <ol className="list-decimal ml-5 space-y-2 mb-4">
              <li>
                <strong>Detect date changes:</strong> Compare old and new date
                when updating todos, and delete all overrides when it has
                changed
              </li>
            </ol>
            <pre className="language-ts p-2 rounded-md overflow-x-auto font-mono text-sm mb-4">
              <code>
                {`async function updateRecurrenceRule(todoId: string, newRrule: string, newDtstart: Date) {
  // Delete all overrides
  await prisma.todoInstance.deleteMany({
    where: { todoId }
  });
  
  // Update parent todo
  await prisma.todo.update({
    where: { id: todoId },
    data: { rrule: newRrule, dtstart: newDtstart }
  });
}`}
              </code>
            </pre>
            <p className="mb-4 font-medium">Pros:</p>
            <ul className="list-disc ml-5 space-y-1 mb-4">
              <li>Simplest solution to implement</li>
              <li>Completely eliminates drifting issues</li>
              <li>No complex mapping or recalculation logic needed</li>
              <li>Fast execution with minimal database queries</li>
            </ul>
            <p className="mb-4 font-medium">Cons:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>All user customizations are permanently lost</li>
              <li>Completion states for individual instances are deleted</li>
              <li>
                May frustrate users who have invested time in customizing
                instances
              </li>
              <li>No way to undo once overrides are removed</li>
            </ul>
          </section>
        </section>

        <hr className="my-6" />
      </div>

      <TableOfContents className="hidden xl:block" />
    </>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono bg-popover-accent px-1 rounded">{children}</code>
  );
}

function TableOfContents({ className }: { className?: string }) {
  return (
    <aside className={cn("w-100 py-10 ", className)}>
      <nav className="sticky top-20">
        <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
        <a href="#overview" className="hover:underline hover:text-foreground">
          Overview
        </a>
        <ol className="list-decimal ml-5 space-y-1 text-[0.9rem] text-foreground/80">
          <li>
            <a
              href="#the-problem"
              className="hover:underline  hover:text-foreground"
            >
              The Problem
            </a>
          </li>
          <li>
            <a
              href="#root-cause"
              className="hover:underline hover:text-foreground"
            >
              Root Cause Analysis
            </a>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>
                <a
                  href="#static-reference"
                  className="hover:underline hover:text-foreground"
                >
                  Static Instance Date Reference
                </a>
              </li>
              <li>
                <a
                  href="#sequence-dependency"
                  className="hover:underline hover:text-foreground"
                >
                  Sequence Dependency
                </a>
              </li>
              <li>
                <a
                  href="#matching-failure"
                  className="hover:underline hover:text-foreground"
                >
                  Override Matching Failure
                </a>
              </li>
            </ol>
          </li>
          <li>
            <a href="#impact" className="hover:underline hover:text-foreground">
              Impact and Edge Cases
            </a>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>
                <a
                  href="#user-visible-impact"
                  className="hover:underline hover:text-foreground"
                >
                  User-Visible Impact
                </a>
              </li>
              <li>
                <a
                  href="#data-integrity"
                  className="hover:underline hover:text-foreground"
                >
                  Data Integrity Issues
                </a>
              </li>
              <li>
                <a
                  href="#edge-cases"
                  className="hover:underline hover:text-foreground"
                >
                  Common Edge Cases
                </a>
              </li>
            </ol>
          </li>
          <li>
            <a
              href="#potential-solutions"
              className="hover:underline hover:text-foreground"
            >
              Potential Solutions
            </a>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>
                <a
                  href="#solution-recalculation"
                  className="hover:underline hover:text-foreground"
                >
                  Recalculate Instance Dates
                </a>
              </li>
              <li>
                <a
                  href="#solution-position-based"
                  className="hover:underline hover:text-foreground"
                >
                  Position-Based References
                </a>
              </li>
              <li>
                <a
                  href="#solution-remove"
                  className="hover:underline hover:text-foreground"
                >
                  removing all overrides
                </a>
              </li>
            </ol>
          </li>
        </ol>
      </nav>
    </aside>
  );
}
