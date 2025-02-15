"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AiOutlineLoading3Quarters as Loading } from "react-icons/ai";
const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div>
        <Loading className="border" />
      </div>

      <form
        className="flex flex-col p-8 rounded-lg bg-card w-fit gap-4 m-auto mt-40"
        action={handleSubmit}
      >
        <label>Email</label>
        <input name="email" type="email" required />
        <label>Password</label>
        <input name="password" type="password" required />
        <button className="border" type="submit">
          Sign In
        </button>
      </form>
    </>
  );
};

export default LoginPage;

{
}
