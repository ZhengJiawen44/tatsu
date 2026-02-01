import ProjectContainer from '@/features/project/component/projectContainer'
import React from 'react'

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    return <ProjectContainer id={params.id} />;
}