import React, { Dispatch, useEffect, useRef } from 'react';
import ProjectTag from '@/components/ProjectTag';


type ProjectMeta = { id: string; name: string };

type NLPProjectDropdownProps = {
    // projects is an array of [id, { name: string }]
    projects: [string, { name: string }][];
    onSelect: (project: ProjectMeta) => void;
    style?: React.CSSProperties;
    selectedIndex: number;
    setSelectedIndex: Dispatch<number>;
};

export function ProjectAutoComplete({ projects, onSelect, style, selectedIndex, setSelectedIndex }: NLPProjectDropdownProps) {
    const listRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        // when selected changes, ensure it is visible
        const node = optionRefs.current[selectedIndex];
        if (node && listRef.current) {
            const listRect = listRef.current.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top < listRect.top) node.scrollIntoView({ block: "nearest" });
            else if (nodeRect.bottom > listRect.bottom) node.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    if (!projects.length) return null;
    return (
        <div
            style={style}
            ref={listRef}
            className="z-50 bg-popover border rounded-md shadow-md w-56 absolute p-2 max-h-48 overflow-auto"
            role="listbox"
            aria-activedescendant={`project-option-${selectedIndex}`}
        >
            {projects.map(([key, value], i) => (
                <div
                    key={key}
                    id={`project-option-${i}`}
                    ref={(el) => {
                        optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={selectedIndex === i}
                    className={`cursor-pointer text-sm font-normal p-1.5 rounded-sm flex items-center gap-1 ${selectedIndex === i ? "bg-popover-accent" : ""
                        }`}
                    onMouseEnter={() => setSelectedIndex(i)}
                    onClick={() => onSelect({ id: key, name: value.name })}
                >
                    <ProjectTag id={key} className="text-sm pr-0" /> {value.name}
                </div>
            ))}
        </div>
    );
}