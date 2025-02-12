import React from "react";
import { signIn } from "@/app/auth";
const page = () => {
  return (
    <form
      className="flex flex-col p-8 rounded-lg bg-card w-fit gap-4 m-auto mt-40"
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", formData);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <label>Email</label>
      <input name="email" type="email" />

      <label>Password</label>
      <input name="password" type="password" />

      <button className="border">Sign In</button>
    </form>
  );
};

export default page;
