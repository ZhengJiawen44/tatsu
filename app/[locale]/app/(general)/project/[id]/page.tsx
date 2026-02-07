import ProjectContainer from '@/features/project/component/ProjectContainer'
import React from 'react'

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <ProjectContainer id={id} />;
}