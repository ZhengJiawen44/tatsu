import { DAVCalendar, DAVNamespaceShort } from "tsdav";
import createCaldavClientFromDB from "./createCaldavClientFromDB";

type CalDavClient = Awaited<
  ReturnType<typeof createCaldavClientFromDB>
>["calDavClient"];

type CalendarWithPrivileges = Pick<DAVCalendar, "url"> & {
  projectedProps: {
    currentUserPrivilegeSet: {
      privilege: Record<string, unknown>[];
    };
  };
};

/**
 * @description fetches each remote calendar URL and the names in its current-user-privilege-set
 * @param calDavClient authenticated CalDAV client
 * @returns calendar URLs paired with privilege names such as "read" and "writeContent"
 */
export async function getCalendarPrivilegeMap(calDavClient: CalDavClient) {
  const calendarPriviliegeMapRaw = (await calDavClient.fetchCalendars({
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: {},
      [`${DAVNamespaceShort.DAV}:resourcetype`]: {},
      [`${DAVNamespaceShort.CALDAV}:supported-calendar-component-set`]: {},
      [`${DAVNamespaceShort.DAV}:current-user-privilege-set`]: {},
    },
    projectedProps: {
      currentUserPrivilegeSet: true,
    },
  })) as CalendarWithPrivileges[];

  return calendarPriviliegeMapRaw.map((x) => {
    return {
      url: x.url,
      privileges: x.projectedProps.currentUserPrivilegeSet.privilege.map(
        (entry) => Object.keys(entry)[0],
      ),
    };
  });
}
