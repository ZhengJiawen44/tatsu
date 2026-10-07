import { DAVNamespaceShort } from "tsdav";
import createCaldavClientFromDB from "./createCaldavClientFromDB";
import { InternalError } from "../customError";

type LocalCalendar = {
    id: string;
    url: string;
    source: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    timezone: string | null;
    ctag: string | null;
    syncToken: string | null;
    credentialId: string;
    components: string[];
}
/**
 * @description wraps tsdav's syncCalendars function with ability to create new calendar if no calendars exist
 * @param localCalendars existing calendars from db
 * @param userId 
 * @returns created, updated, and deleted calendars
 */
export async function syncCalendars(localCalendars:LocalCalendar[], userId:string){
    const { calDavClient } = await createCaldavClientFromDB(userId);
    const { created, updated, deleted } = await calDavClient.syncCalendars({
      oldCalendars: localCalendars.map((localCalendar) => {
        return {
          displayName: localCalendar.name || undefined,
          syncToken: localCalendar.syncToken || undefined,
          ctag: localCalendar.ctag || undefined,
          url: localCalendar.url,
        };
      }),
      detailedResult: true,
    });

    if(created.length || localCalendars.length)
        return {created, updated, deleted}


    // if no calendars exist, create one
    const account = await calDavClient.createAccount({
        account: { accountType: "caldav" },
    });
    if (!account.homeUrl)
        throw new InternalError("could not find calendar home");
    const homeUrl = account.homeUrl.endsWith("/") ? account.homeUrl : `${account.homeUrl}/`;
    const result = await calDavClient.makeCalendar({
        url: `${homeUrl}${crypto.randomUUID().replace(/-/g, "")}/`,
        props:{
            displayname: 'tatsu calendar',
            [`${DAVNamespaceShort.CALDAV}:calendar-description`]: 'calendar for the tatsu app',
        },
        fetchOptions: {
            headers: {
                "User-Agent": "tatsu",
            },
        },
    })

    if(!result[0].ok)
        throw new InternalError("could not create tatsu calendar, "+result[0].raw)

    const tatsuCalendar = (
        await calDavClient.syncCalendars({
            detailedResult: true,
            oldCalendars: localCalendars.map((localCalendar) => {
                return {
                    displayName: localCalendar.name || undefined,
                    syncToken: localCalendar.syncToken || undefined,
                    ctag: localCalendar.ctag || undefined,
                    url: localCalendar.url,
                };
            }),
        })).created;

    return {created: tatsuCalendar, updated, deleted}
        
}