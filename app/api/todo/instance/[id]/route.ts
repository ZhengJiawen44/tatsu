import { BadRequestError, InternalError, UnauthorizedError } from '@/lib/customError'
import { prisma } from '@/lib/prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { Priority } from '@prisma/client'
import { todoSchema } from '@/schema'
import { auth } from '@/app/auth'
import { errorHandler } from '@/lib/errorHandler'
import createCaldavClientFromDB from '@/lib/sync/createCaldavClientFromDB'
import ICAL from 'ical.js'
import { parseIcsToVeventComponent } from '@/lib/sync/parseIcsToComponent'
import { updateIcs } from '@/lib/sync/updateIcs'
import { toMasterShapedTime } from '@/lib/sync/toMasterShapedDate'
import populateMetaProperties from '@/lib/sync/inheritFromMaster'
// import { genICSData } from '@/lib/sync/genIcsDataFromLocal'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = session?.user

    if (!user?.id) throw new UnauthorizedError('You must be logged in to do this')

    const { id } = await params
    if (!id) throw new BadRequestError('Invalid request, ID is required')

    let body = await req.json()

    if (!body.instanceDate) {
      throw new BadRequestError('instanceDate is required to update a TodoInstance')
    }

    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
      instanceDate: new Date(body.instanceDate)
    }
    const parsedObj = todoSchema.partial().safeParse(body)
    if (!parsedObj.success) throw new BadRequestError('Invalid request body')

    const { title, description, priority, dtstart, due } = parsedObj.data
    const { instanceDate } = body

    if (!dtstart) {
      throw new BadRequestError('dtstart is required to update a TodoInstance')
    }
    const todoToUpdate = await prisma.todo.findUnique({
      where: {
        userID: user.id,
        id
      },
      include: {
        syncMetaData: {
          include: { caldavCalendar: true }
        }
      }
    })

    const syncMetaData = todoToUpdate?.syncMetaData
    const calendar = todoToUpdate?.syncMetaData?.caldavCalendar

    if (syncMetaData) {
      if (!calendar) throw new InternalError('couldnt find remote calendar this todo belongs to')
      if (dtstart === null || due === null)
        throw new BadRequestError('todos synced to remote cannot have null dtstart or due')

      const oldIcs = syncMetaData.icsData
      console.log("before----------------------------- ", oldIcs)
      if (!oldIcs) throw new InternalError('ics data does not exist for the given todo')
      const component = parseIcsToVeventComponent(oldIcs)
      const allVevents = component.getAllSubcomponents('vevent')

      let isInstanceFound = false;
      const instance = allVevents.find((vevent)=>{
        const recurenceID = vevent.getFirstProperty("recurrence-id")?.getFirstValue() as ICAL.Time;
        if(recurenceID && recurenceID.toJSDate().toString() === instanceDate.toString()){
          isInstanceFound = true
          return true
        }
        return false ;
      }) || new ICAL.Component("vevent")

      const tzid = component.getFirstSubcomponent("vtimezone")?.getFirstPropertyValue('tzid') as string | null
      const master = allVevents.find(v => !v.getFirstProperty('recurrence-id'))
      if(!master) throw new InternalError("event master not found")
      const masterDtstart = master.getFirstPropertyValue("dtstart") as unknown as ICAL.Time
      
      if(title) instance.updatePropertyWithValue("summary", title)
      if(description) instance.updatePropertyWithValue("description", description)
      if(dtstart) instance.updatePropertyWithValue("dtstart", toMasterShapedTime(dtstart, masterDtstart))
      if(due) instance.updatePropertyWithValue("dtend", toMasterShapedTime(due, masterDtstart))
      instance.updatePropertyWithValue("last-modified", ICAL.Time.fromJSDate(new Date(), true))
      if (tzid) {
        instance.getFirstProperty('dtstart')!.setParameter('tzid', tzid)
        instance.getFirstProperty('dtend')!.setParameter('tzid', tzid)
      }

      if(!isInstanceFound){
        
        populateMetaProperties(instance, master)
        instance.addPropertyWithValue("recurrence-id", toMasterShapedTime(instanceDate, masterDtstart))
         if (tzid) 
        instance.getFirstProperty('recurrence-id')!.setParameter('tzid', tzid)
        
      
        component.addSubcomponent(instance)
      }
 

      console.log("after:------------------------ ", component.toString())

    }
    await prisma.todoInstance.upsert({
      where: {
        todoId_instanceDate: {
          todoId: id,
          instanceDate
        }
      },
      update: {
        overriddenTitle: title,
        overriddenDescription: description,
        overriddenPriority: priority as Priority,
        overriddenDtstart: dtstart,
        overriddenDue: due,
        overriddenDurationMinutes: dtstart && due ? (due?.getTime() - dtstart?.getTime()) / (1000 * 60) : undefined
      },
      create: {
        todoId: id,
        recurId: instanceDate.toISOString(),
        instanceDate: instanceDate,
        overriddenTitle: title,
        overriddenDescription: description,
        overriddenPriority: priority,
        overriddenDtstart: dtstart,
        overriddenDue: due,
        overriddenDurationMinutes: dtstart && due ? (dtstart?.getTime() - due?.getTime()) / (1000 * 60) : undefined
      }
    })

    return NextResponse.json({ message: 'Todo updated' }, { status: 200 })
  } catch (error) {
    return errorHandler(error)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = session?.user

    if (!user?.id) throw new UnauthorizedError('you must be logged in to do this')

    const { id } = await params
    const instanceDate = new Date(Number(req.nextUrl.searchParams.get('instanceDate')))
    if (!id || !instanceDate)
      throw new BadRequestError('Invalid request, ID or instanceDate is required to do instance delete!')

    //to remove an instance first edit the ics data in the todo, and then exdate the instance date

    // Find and exadate the local todo
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { exdates: { push: [instanceDate] } },
      include: {
        syncMetaData: {
          select: {
            remoteUrl: true,
            etag: true,
            icsData: true
          }
        }
      }
    })

    //update calendar object's exdate property
    const syncMetaData = updatedTodo.syncMetaData
    if (syncMetaData && syncMetaData.icsData) {
      const comp = parseIcsToVeventComponent(syncMetaData.icsData)
      const vevent = comp.getFirstSubcomponent('vevent')
      if (!vevent) throw new Error('could not find vevent subcomponent in parsed ICS data')
      vevent.addPropertyWithValue('exdate', ICAL.Time.fromJSDate(instanceDate))
      const updatedIcsComp = ICAL.stringify(comp.toJSON())
      const { calDavClient } = await createCaldavClientFromDB(user.id)
      const res = await calDavClient.updateCalendarObject({
        calendarObject: {
          url: syncMetaData.remoteUrl,
          etag: syncMetaData.etag,
          data: updatedIcsComp
        }
      })

      //sync local sync data
      const updatedLocalIcs = updateIcs(syncMetaData.icsData, {
        name: 'exdate',
        value: updatedTodo.exdates.map((d: Date) => ICAL.Time.fromJSDate(d))
      })
      const etag = res.headers.get('etag') ?? ''
      await prisma.syncMetaData.update({
        where: { todoId: updatedTodo.id },
        data: { etag, icsData: updatedLocalIcs }
      })
    }

    return NextResponse.json({ message: 'todo deleted' }, { status: 200 })
  } catch (error) {
    console.log(error)

    // Handle custom error
    return errorHandler(error)
  }
}
