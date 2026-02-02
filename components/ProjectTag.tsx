import React from 'react'
import { useProjectMetaData } from './Sidebar/Project/query/get-project-meta';
import clsx from 'clsx';

export default function ProjectTag({ id, className }: { id: string, className?: string }) {
    const { projectMetaData } = useProjectMetaData();
    console.log(projectMetaData[id]?.color)

    const colorClass = clsx({
        "text-accent-red": projectMetaData[id]?.color === "RED",
        "text-accent-orange": projectMetaData[id]?.color === "ORANGE",
        "text-accent-yellow": projectMetaData[id]?.color === "YELLOW",
        "text-accent-lime": projectMetaData[id]?.color === "LIME",
        "text-accent-blue": projectMetaData[id]?.color === "BLUE",
        "text-accent-purple": projectMetaData[id]?.color === "PURPLE",
        "text-accent-pink": projectMetaData[id]?.color === "PINK",
        "text-accent-teal": projectMetaData[id]?.color === "TEAL",
        "text-accent-coral": projectMetaData[id]?.color === "CORAL",
        "text-accent-gold": projectMetaData[id]?.color === "GOLD",
        "text-accent-deep-blue": projectMetaData[id]?.color === "DEEP_BLUE",
        "text-accent-rose": projectMetaData[id]?.color === "ROSE",
        "text-accent-light-red": projectMetaData[id]?.color === "LIGHT_RED",
        "text-accent-brick": projectMetaData[id]?.color === "BRICK",
        "text-accent-slate": projectMetaData[id]?.color === "SLATE",
    });

    return <span className={colorClass + " text-lg pr-1 " + className}>{"#"}</span>;
}
