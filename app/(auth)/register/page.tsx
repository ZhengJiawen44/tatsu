"use client";
import React from "react";
const page = () => {
  async function handleSubmit() {
    try {
      await fetch("/api/auth/register", { method: "POST" });
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

      <button className="border">register</button>
    </form>
  );
};

export default page;
