"use client";
import Link from "next/link";
import Image from "next/image";
import { loginSchema } from "@/schema";
import {
  Separator,
  SeparatorLine,
  SeparatorWord,
} from "@/components/ui/separator";
// https://www.joshwcomeau.com/css/designing-shadows/
const page = () => {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const formObject = Object.fromEntries(formData.entries());
      const parsedObj = loginSchema.safeParse(formObject);
      console.log(parsedObj);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formObject),
      });

      const body = await res.json();
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-screen h-screen bg-form-background md:w-[70%] md:h-fit lg:w-[60%]  xl:w-[50%] 2xl:w-[38%]  md:rounded-xl p-[55px] md:p-[85px]
      shadow-[0px_1px_4px_hsl(260,15%,28%),_0px_2px_8px_hsl(260,15%,28%),_0px_4px_16px_hsl(260,15%,28%),_0px_8px_32px_hsl(260,15%,28%),_0px_16px_64px_hsl(260,15%,28%)]"
      >
        {/* header */}
        <h1 className="text-[35px] md:text-[38px] lg:text-[45px] text-white mb-[37px]">
          Create an account
        </h1>
        <p className="text-[14px] text-form-muted mb-[40px]">
          Already have an account?
          <Link
            href="/login"
            className="underline text-form-link hover:text-form-link-accent ml-1"
          >
            Login
          </Link>
        </p>

        {/* form fields */}
        <div
          id="formFieldContainer"
          className="flex flex-col gap-[43px] mb-[50px]"
        >
          <div id="nameFieldContainer" className="flex gap-5">
            <input
              type="text"
              className="bg-form-input rounded-md h-[45px] w-[50%] px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="First Name*"
            ></input>
            <input
              type="text"
              className="bg-form-input rounded-md h-[45px] w-[50%] px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="Last Name"
            ></input>
          </div>
          <input
            type="text"
            className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            placeholder="Email*"
          ></input>
          <input
            type="text"
            className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            placeholder="Enter your password*"
          ></input>
        </div>

        {/* create button, Oauth button */}
        <div id="formActions" className="flex flex-col gap-7">
          <button className="bg-form-button rounded-md text-white px-[18px] py-[10px] w-full hover:bg-form-button-accent transition-all duration-300">
            Create Account
          </button>
          <Separator>
            <SeparatorLine />
            <SeparatorWord>or register with</SeparatorWord>
          </Separator>
          <div id="OauthContainer" className="flex gap-5">
            <button
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image
                src="google.svg"
                alt="apple"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Google</p>
            </button>
            <button
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image
                src="apple.svg"
                alt="apple"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Apple</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;

{
}
