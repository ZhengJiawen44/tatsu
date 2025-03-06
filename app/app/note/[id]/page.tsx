"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useNote } from "@/hooks/useNote";
import Editor from "@/components/Note/Editor";
import NoteLoading from "@/components/Sidebar/Note/NoteLoading";
const Page = () => {
  const router = useRouter();
  const params = useParams();
  const { notes, notesLoading } = useNote(true);
  const note = notes.find(({ id }) => id === params.id);

  useEffect(() => {
    if (!notesLoading && !note) {
      router.replace("/app/todo");
    }
  }, [notesLoading, note, router]);

  if (notesLoading) return <NoteLoading />;

  if (!note) return null;

  return <Editor note={note} />;
};

export default Page;
