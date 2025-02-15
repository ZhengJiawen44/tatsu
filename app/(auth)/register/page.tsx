"use client";
import Link from "next/link";
import Image from "next/image";
import { registrationSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner";
import {
  Separator,
  SeparatorLine,
  SeparatorWord,
} from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { RegisterFormProp } from "@/types/RegisterForm";

// https://www.joshwcomeau.com/css/designing-shadows/
const page = () => {
  async function onSubmit(data: RegisterFormProp) {
    try {
      const res = await fetch("/api/auth/register", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      const body = await res.json();
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<RegisterFormProp>({ resolver: zodResolver(registrationSchema) });

  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            <div className="w-[50%]">
              <input
                {...register("fname")}
                type="text"
                className="w-full bg-form-input rounded-md h-[45px] px-[18px] focus:outline-none focus:outline-form-border"
                placeholder="First Name*"
              />
              {errors.fname && (
                <p className="text-sm text-white mt-3">
                  {errors.fname.message}
                </p>
              )}
            </div>

            <div className="w-[50%]">
              <input
                {...register("lname")}
                type="text"
                className="w-full bg-form-input rounded-md h-[45px] px-[18px] focus:outline-none focus:outline-form-border"
                placeholder="Last Name"
              />
              {errors.lname && (
                <p className="text-sm text-white mt-3">
                  {errors.lname.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <input
              {...register("email")}
              type="text"
              className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="Email*"
            />
            {errors.email && (
              <p className="text-sm text-white mt-3">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="Enter your password*"
            />
            {errors.password && (
              <p className="text-sm text-white mt-3">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* create button, Oauth button */}
        <div id="formActions" className="flex flex-col gap-7">
          <button
            disabled={isSubmitting || isLoading}
            className="flex justify-center items-center gap-2 bg-form-button rounded-md text-white px-[18px] h-11 w-full hover:bg-form-button-accent transition-all duration-300"
          >
            {isSubmitting && <Spinner className="w-7 h-7" />}
            Create an Account
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
