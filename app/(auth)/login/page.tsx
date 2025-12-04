"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import EyeToggle from "@/components/ui/eyeToggle";
import {
  Separator,
  SeparatorLine,
  SeparatorWord,
} from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { LoginFormProp } from "@/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const LoginPage = () => {
  // setup react-hook-form, toast, router, and password visibillity toggle
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<LoginFormProp>({ resolver: zodResolver(loginSchema) });
  const { toast } = useToast();
  const router = useRouter();
  const [show, setShow] = useState(false);

  // redirect to app page if user exists
  const session = useSession();
  useEffect(() => {
    if (session.status !== "loading" && session.status === "authenticated") {
      router.push("/app/todo");
    }
  }, [router, session.status, session.data?.user]);
  // define login page ui
  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center bg-gradient-to-br from-gray-800 to-gray-400">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-20" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-50 w-screen h-screen bg-form-background md:w-[70%] md:h-fit lg:w-[60%]  xl:w-[50%] 2xl:w-[38%]  md:rounded-xl p-[55px] md:p-[85px]
        shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.2)]"
      >
        {/* header section */}
        <h1 className="text-[35px] md:text-[38px] lg:text-[45px] text-white mb-[37px]">
          Login
        </h1>

        <div className="flex flex-col gap-9 mb-9">
          <div id="OauthContainer" className="flex gap-5">
            <button
              onClick={onGoogle}
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image
                src="google.svg"
                alt="google-logo"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Google</p>
            </button>
            <button
              onClick={onDiscord}
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image
                src="discord.svg"
                alt="discord-logo"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Discord</p>
            </button>
          </div>

          <Separator>
            <SeparatorLine />
            <SeparatorWord>or log in with</SeparatorWord>
          </Separator>
        </div>

        {/* form fields */}
        <div
          id="formFieldContainer"
          className="flex flex-col gap-[43px] mb-[15px]"
        >
          <div>
            <input
              {...register("email")}
              type="text"
              className="text-white  bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="Email*"
            />
            {errors.email && (
              <p className="text-sm text-white mt-3">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div id="PasswordField" className="relative h-[45px]">
              <input
                {...register("password")}
                type={show ? "text" : "password"}
                className="absolute inset-0 z-0 text-white bg-form-input rounded-md w-full px-[18px] pr-[55px] focus:outline-none focus:outline-form-border"
                placeholder="Enter your password*"
              />
              <EyeToggle show={show} setShow={setShow} />
            </div>

            {errors.password && (
              <p className="text-sm text-white mt-3">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <p className="text-[14px] text-form-muted mb-[40px]">
          Do not have an account?
          <Link
            href="/register"
            className="underline text-form-link hover:text-form-link-accent ml-1"
          >
            Register
          </Link>
        </p>
        {/* create account button, Oauth button */}
        <div id="formActions" className="flex flex-col gap-7">
          <button
            disabled={isSubmitting || isLoading}
            className="flex justify-center items-center gap-2 bg-form-button rounded-md text-white px-[18px] h-11 w-full hover:bg-form-button-accent transition-all duration-300"
          >
            {isSubmitting && <Spinner className="w-7 h-7" />}
            Login
          </button>
        </div>
      </form>
    </div>
  );

  // login functions
  async function onGoogle() {
    try {
      const result = await signIn("google", { callbackUrl: "/app/todo" });
      if (result?.error) {
        toast({ title: "we could not sign you in to google at the moment" });
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "we could not sign you in to google at the moment" });
    }
  }
  async function onDiscord() {
    try {
      const result = await signIn("discord", { callbackUrl: "/app/todo" });
      if (result?.error) {
        toast({ title: "we could not sign you in to discord at the moment" });
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "we could not sign you in to discord at the moment" });
    }
  }
  async function onSubmit(data: LoginFormProp) {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl: "/app/todo",
      });

      if (result?.error) {
        toast({ title: "invalid email or password" });
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "we cannot log you in at this moment" });
    }
  }
};

export default LoginPage;

{
}
