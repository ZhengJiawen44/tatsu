"use client";
import React, { FormEvent } from "react";
const page = () => {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const formObject = Object.fromEntries(formData.entries());

      await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formObject),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form
      className="flex flex-col p-8 rounded-lg bg-card w-fit gap-4 m-auto mt-40"
      onSubmit={handleSubmit}
    >
      <label>Email</label>
      <input name="email" type="email" />

      <label>Password</label>
      <input name="password" type="password" />

      <button className="border" type="submit">
        register
      </button>
    </form>
  );
};

export default page;
