"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useNote } from "@/hooks/useNote";
import Editor from "@/components/Note/Editor";
import NoteLoading from "@/components/newSidebar/SidebarItems/NoteLoading";
import { notFound } from "next/navigation";
const page = () => {
  const params = useParams();

  const { notes, notesLoading } = useNote(true);
  const note = notes.find(({ id }) => id === params.id);

  if (notesLoading) return <NoteLoading />;

  if (!note) {
    console.log("not found");

    notFound();
  }
  return <Editor note={note} />;
};

export default page;
