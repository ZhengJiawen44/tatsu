"use client"
import React from 'react'
import { useProject } from '../query/get-project-todos'
export default function ProjectContainer({ id }: { id: string }) {
    const { projectTodos } = useProject({ id });
    return (
        <div>{projectTodos.map((todo) => { return <div key={todo.id}>{todo.title}</div> })}</div>
    )
}
