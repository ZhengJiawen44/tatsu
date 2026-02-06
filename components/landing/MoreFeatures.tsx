import React from 'react'
{/* 
sort, group
themable projects
shortcuts
adjustable calendar views
nlp supported project, date time
repeat rrule logic
privacy
*/}

const featureMap = [
    {
        title: "Customizable page",
        description: "Sort, filter and Group by priority, deadline, projects and many more to create your own personalized view"
    },
    {
        title: "Shortcuts",
        description: "Capture tasks at the speed of thought using shortcuts without ever reaching for the mouse"
    },
    {
        title: "NLP assisted task capture ",
        description: "Frictionless creation of tasks with date ranges, projects, and priorities in a single line"
    },
    {
        title: "Colorful tasks",
        description: "Group your tasks into color rich projects and never get lost in a sea of tasks again"
    },
    {
        title: "Repeat logic",
        description: "Set your tasks to repeat at highly customziable intervals and recieve them as they occur"
    },
    {
        title: "Privacy",
        description: "All user data stays private — no sensitive information is stored or shared, and there are no ads or third-party trackers."
    }
]
export default function MoreFeatures() {
    return (
        <>
            {featureMap.map(({ title, description }) => {
                return <div key={title} className="rounded-md w-96 p-4 text-start border bg-background shadow-xs">
                    <p className="text-lg font-semibold mb-2">
                        {title}
                    </p>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
            })
            }
        </>
    )
}
