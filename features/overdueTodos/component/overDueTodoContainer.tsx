"use client"
import React from 'react'
import { useOverdueTodo } from '../query/get-overdue-todo'
import TodoListLoading from '@/components/ui/TodoListLoading';
import TodoGroup from '@/components/todo/TodoGroup';
import LineSeparator from '@/components/ui/lineSeparator';
export default function OverDueTodoContainer() {
    const { todos: overdueTodos, todoLoading } = useOverdueTodo();

    return (
        <div className='mb-20'>
            <div className="flex items-center gap-2 mt-10 mb-4">
                <h3 className="text-lg font-semibold select-none">
                    Overdue
                </h3>
                <LineSeparator className="flex-1" />
            </div>
            <div>
                {todoLoading && <TodoListLoading />}
                <TodoGroup todos={overdueTodos.slice(0, 3)} overdue={true} />

                <button

                    className="my-10 ml-[2px] w-fit group flex gap-3 items-center  hover:cursor-pointer transition-all duration-200"
                >
                    <p className="text-muted-foreground text-[0.95rem] group-hover:text-foreground ">
                        Show more
                    </p>
                </button>

            </div>
        </div>

    )
}


