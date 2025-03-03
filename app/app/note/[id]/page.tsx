"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useNote } from "@/hooks/useNote";

const page = () => {
  const params = useParams();
  const { notes } = useNote(true);
  console.log(notes.filter(({ id }) => id === params.id));

  return <div>page</div>;
};

export default page;
