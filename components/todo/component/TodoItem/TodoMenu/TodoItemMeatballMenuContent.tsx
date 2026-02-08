import LineSeparator from "@/components/ui/lineSeparator";
import {
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import Spinner from "@/components/ui/spinner";
import { SquarePen, Blocks, ArrowRightLeft, Trash } from "lucide-react";
import Pin from "@/components/ui/icon/pin";
import Unpin from "@/components/ui/icon/unpin";
import { TodoItemType } from "@/types";
import { useTranslations } from "next-intl";
import { useTodoMutation } from "@/providers/TodoMutationProvider";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import ProjectTag from "@/components/ProjectTag";
import { Flag } from "lucide-react";

function TodoItemMeatballMenu({
    todo,
    setDisplayForm,
    setEditInstanceOnly,
}: {
    todo: TodoItemType;
    setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>;
    setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const todayDict = useTranslations("today");
    const { usePrioritizeTodo, useDeleteTodo, usePinTodo, useEditTodo } = useTodoMutation();
    const { prioritizeMutateFn } = usePrioritizeTodo();
    const { editTodoMutateFn } = useEditTodo();
    const { deleteMutateFn, deletePending } = useDeleteTodo();
    const { pinMutateFn } = usePinTodo();
    const { projectMetaData } = useProjectMetaData();
    return (

        <>
            <DropdownMenuItem className="mx-1 p-1.5 px-2 gap-2" onClick={() => pinMutateFn(todo)}>
                {!todo.pinned ? (
                    <Pin className="" />
                ) : (
                    <Unpin />
                )}
                {todo.pinned ? todayDict("menu.unpin")
                    : todayDict("menu.pinToTop")
                }
            </DropdownMenuItem>
            <DropdownMenuItem
                className="m-1.5"
                onClick={() => {
                    setDisplayForm((prev: boolean) => !prev);
                }}
            >
                <SquarePen strokeWidth={1.7} className="w-4! h-4!" />
                {todayDict("menu.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
                className="m-1.5"
                onClick={() => {
                    setEditInstanceOnly(true);
                    setDisplayForm((prev: boolean) => !prev);
                }}
            >
                <Blocks strokeWidth={1.7} className="w-4! h-4!" />
                {todayDict("menu.editAsInstance")}

            </DropdownMenuItem>

            {/* move to project sub menu */}
            <DropdownMenuSub>
                <DropdownMenuSubTrigger className="bg-inherit hover:bg-popover mx-1">
                    <ArrowRightLeft strokeWidth={1.7} className="w-4! h-4!" />
                    Move to...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-56 overflow-scroll">
                    {Object.entries(projectMetaData).map(([key, value]) => {
                        const dateRangeChecksum = todo.dtstart.toISOString() + todo.due.toISOString();
                        const rruleChecksum = todo.rrule
                        return <DropdownMenuItem
                            key={key}
                            onClick={() => {
                                editTodoMutateFn({ ...todo, projectID: key, dateRangeChecksum, rruleChecksum })
                            }}>
                            <ProjectTag id={key} className="text-base pr-0" />{value.name}
                        </DropdownMenuItem>
                    })}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
                className="m-1.5"
                onClick={() => deleteMutateFn({ id: todo.id })}
            >
                {deletePending ? (
                    <Spinner className="w-4! h-4!" />
                ) : (
                    <Trash strokeWidth={1.7} className="w-4! h-4!" />
                )}
                {todayDict("menu.delete")}

            </DropdownMenuItem>
            <LineSeparator className=" my-3 w-full" />

            <DropdownMenuItem
                className="flex-col items-start hover:bg-inherit! cursor-default text-xs gap-4 pb-4"
                onClick={() => { }}
            >
                <p className="text-sm font-semibold text-card-foreground-muted ">
                    priority
                </p>
                <div className=" flex gap-4 items-center pl-2">
                    <button className="group cursor-pointer"
                        onClick={() => {
                            prioritizeMutateFn({
                                id: todo.id,
                                level: "Low",
                                isRecurring: todo.rrule ? true : false,
                            });
                        }}>
                        <Flag
                            className="text-lime group-hover:fill-lime"
                        />
                    </button>

                    <button className="group cursor-pointer"
                        onClick={() => {
                            prioritizeMutateFn({
                                id: todo.id,
                                level: "Medium",
                                isRecurring: todo.rrule ? true : false,
                            });
                        }}>
                        <Flag
                            className="text-orange group-hover:fill-orange"
                        />
                    </button>
                    <button className="group cursor-pointer"
                        onClick={() => {
                            prioritizeMutateFn({
                                id: todo.id,
                                level: "High",
                                isRecurring: todo.rrule ? true : false,
                            });
                        }}>
                        <Flag
                            className="text-red group-hover:fill-red"
                        />
                    </button>
                </div>
            </DropdownMenuItem>
        </>

    );
}

export default TodoItemMeatballMenu;
