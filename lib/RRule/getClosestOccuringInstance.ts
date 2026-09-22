import { recurringTodoItemType } from "@/types";

/**
 * 
 * @param ghostTodos a list of todo instances, a result of expanding recurring todos
 * @param dateRangeStart a date object, used to locate the closestOccurringInstance
 * @returns a list of todo instances whose occurence due on or after dateRangeStart, and if not, then the closest instance to the left of the dateRangeStart
 */
export function getClosestOccuringInstance(
    ghostTodos: recurringTodoItemType[], 
    dateRangeStart: Date
) : recurringTodoItemType[]{

    // group the instances by their master id, so that each recurring todo can have atleast one closestOccuringInstance
    const recurrenceGroup = Object.groupBy(ghostTodos, (todo)=>todo.id) as Record<string, recurringTodoItemType[]>;

    // for each master group, find the instances that due on or after dateRangeStart or the instance closest to the left of the dateRangeStart
    return Object.entries(recurrenceGroup).flatMap((instanceGroup)=>{

        // const masterTodoId = instanceGroup[0];  just so you know
        const instances = instanceGroup[1];

        const incompleteInstances = instances.filter((instance) => 
            instance.completed === false
        )

        const withinRangeInstances =  incompleteInstances.filter((instance) => 
            (!instance.due || instance.due >= dateRangeStart)
        );

        if(withinRangeInstances.length !==0 ) return withinRangeInstances;

        const closestOccuringInstance = incompleteInstances.filter((instance) => 
            (!instance.due || instance.due <= dateRangeStart)
        ).at(-1);

        return closestOccuringInstance ? [closestOccuringInstance] : []
    })
}