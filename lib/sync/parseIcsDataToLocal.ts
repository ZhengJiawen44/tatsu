import { TodoItemType } from '@/types'
import { Priority } from '@prisma/client'
import ICAL from 'ical.js'
import { parseIcsToVeventComponent } from './parseIcsToComponent'

/** Parsed recurrence override rows, aligned with `TodoInstance` / `overridingInstance` shape for sync upserts */
export type ParsedIcsInstance = {
  instanceDate: Date
  recurId: string
  overriddenTitle: string | null
  overriddenDescription: string | null
  overriddenPriority: Priority | null
  overriddenDtstart: Date | null
  overriddenDue: Date | null
  overriddenDurationMinutes: number | null
}

export type ParsedIcsDataWithInstances = {
  master: Omit<
    TodoItemType,
    'id' | 'pinned' | 'createdAt' | 'order' | 'userID' | 'completed' | 'instances' | 'instanceDate' | 'projectID'
  > & { uid: string }
  instances: ParsedIcsInstance[]
}

type ParsedVeventCore = {
  summary: string | null
  description: string | null
  uid: string
  dtstart: ICAL.Time | null
  dtend: ICAL.Time | null
  duration: ICAL.Duration | null
  exdates: Date[]
  durationMinutes: number
  priority: Priority
  timeZone: string
}

function mapVeventPriority(raw: number | null): Priority {
  if (raw === null || raw === 0) return 'Low'
  if (raw <= 4) return 'High'
  if (raw === 5) return 'Medium'
  return 'Low'
}

function parseVeventCore(vevent: ICAL.Component): ParsedVeventCore | null {
  const uid = vevent.getFirstPropertyValue('uid') as string | undefined
  if (!uid) return null

  const summary = vevent.getFirstPropertyValue('summary') as string | null
  const description = vevent.getFirstPropertyValue('description') as string | null
  const dtstart = vevent.getFirstPropertyValue('dtstart') as ICAL.Time | null
  const dtend = vevent.getFirstPropertyValue('dtend') as ICAL.Time | null
  const duration = vevent.getFirstPropertyValue('duration') as ICAL.Duration | null
  const exdateProp = vevent.getAllProperties('exdate')
  const exdates = exdateProp.flatMap(p => p.getValues().map((v: ICAL.Time) => v.toJSDate()))

  let durationMinutes = 30
  if (duration) {
    durationMinutes = duration.toSeconds() / 60
  } else if (dtstart && dtend) {
    durationMinutes = (dtend.toUnixTime() - dtstart.toUnixTime()) / 60
  }

  const rawPriority = vevent.getFirstPropertyValue('priority') as number | null

  return {
    summary,
    description: description ?? null,
    uid,
    dtstart,
    dtend,
    duration,
    exdates,
    durationMinutes: Math.round(durationMinutes),
    priority: mapVeventPriority(rawPriority),
    timeZone: dtstart?.zone.tzid ?? 'UTC'
  }
}

function veventTitle(core: ParsedVeventCore): string {
  return core.summary || 'undefined'
}

function veventToMasterFields(vevent: ICAL.Component, core: ParsedVeventCore): ParsedIcsDataWithInstances['master'] {
  const rrule = vevent.getFirstPropertyValue('rrule') as ICAL.Recur | null
  return {
    uid: core.uid,
    title: veventTitle(core),
    description: core.description,
    dtstart: core.dtstart?.toJSDate() ?? undefined,
    due: core.dtend?.toJSDate() ?? undefined,
    durationMinutes: core.durationMinutes,
    rrule: rrule ? rrule.toString() : null,
    exdates: core.exdates,
    timeZone: core.timeZone,
    priority: core.priority
  }
}

function parseRecurrenceOverride(
  vevent: ICAL.Component,
  master: ParsedIcsDataWithInstances['master'],
  masterCore: ParsedVeventCore
): ParsedIcsInstance | null {
  const rid = vevent.getFirstPropertyValue('recurrence-id') as ICAL.Time | null
  if (!rid) return null

  const instanceDate = rid.toJSDate()
  const recurId = instanceDate.toISOString()

  const core = parseVeventCore(vevent)
  if (!core || core.uid !== master.uid) return null

  const title = veventTitle(core)
  const dtstartJs = core.dtstart?.toJSDate() ?? null
  const dueJs = core.dtend?.toJSDate() ?? null
  return {
    instanceDate,
    recurId,
    overriddenTitle: title !== master.title ? title : null,
    overriddenDescription: core.description !== masterCore.description ? core.description : null,
    overriddenPriority: core.priority !== masterCore.priority ? core.priority : null,
    overriddenDtstart: dtstartJs,
    overriddenDue: dueJs,
    overriddenDurationMinutes: core.durationMinutes
  }
}

/**
 * parses all VEVENT components in the Ics into ParsedIcsDataWithInstances.
 * where master is the ICAL.component with no `RECURRENCE-ID`;
 * overrides is the ICAL.component with `RECURRENCE-ID` and same series `UID`.
 * @param icsData string
 * @returns \{master, instances}
 */
export function parseIcsData(icsData: string): ParsedIcsDataWithInstances | null {
  console.log(icsData)
  const comp = parseIcsToVeventComponent(icsData)
  const vevents = comp.getAllSubcomponents('vevent')
  if (vevents.length === 0) return null

  const masterComponent = vevents.find(v => !v.getFirstProperty('recurrence-id')) ?? null
  if (!masterComponent) return null

  const masterCore = parseVeventCore(masterComponent)
  if (!masterCore) return null

  const master = veventToMasterFields(masterComponent, masterCore)

  const instances: ParsedIcsInstance[] = []
  for (const v of vevents) {
    if (!v.getFirstProperty('recurrence-id')) continue
    const ov = parseRecurrenceOverride(v, master, masterCore)
    if (ov) instances.push(ov)
  }
  return { master, instances }
}
