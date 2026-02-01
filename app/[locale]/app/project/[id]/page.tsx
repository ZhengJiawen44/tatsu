import ProjectContainer from '@/features/project/component/projectContainer'
import React from 'react'

interface PageProps {
    params: { id: string };
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <ProjectContainer id={id} />;
}