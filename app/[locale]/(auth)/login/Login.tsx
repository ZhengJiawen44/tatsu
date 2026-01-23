"use client";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import EyeToggle from "@/components/ui/eyeToggle";
import { Separator, SeparatorLine, SeparatorWord } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { LoginFormProp } from "@/types";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("login");

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<LoginFormProp>({ resolver: zodResolver(loginSchema) });

  const { toast } = useToast();
  const [show, setShow] = useState(false);

  // login functions
  async function onGoogle() {
    try {
      const result = await signIn("google", { callbackUrl: "/app/todo" });
      if (result?.error) toast({ title: t("toasts.googleError") });
    } catch (error) {
      console.error(error);
      toast({ title: t("toasts.googleError") });
    }
  }

  async function onDiscord() {
    try {
      const result = await signIn("discord", { callbackUrl: "/app/todo" });
      if (result?.error) toast({ title: t("toasts.discordError") });
    } catch (error) {
      console.error(error);
      toast({ title: t("toasts.discordError") });
    }
  }

  async function onSubmit(data: LoginFormProp) {
    try {
      const result = await signIn("credentials", { ...data, redirect: false, callbackUrl: "/app/todo" });
      if (result?.error) toast({ title: t("toasts.invalidCredentials") });
    } catch (error) {
      console.error(error);
      toast({ title: t("toasts.genericError") });
    }
  }

  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center bg-muted">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-50 w-screen h-screen bg-form-background md:w-[70%] md:h-fit lg:w-[60%] xl:w-[50%] 2xl:w-[38%] md:rounded-xl p-[55px] md:p-[85px] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.2)]"
      >
        {/* header */}
        <h1 className="text-[35px] md:text-[38px] lg:text-[45px] text-white mb-[37px]">
          {t("title")}
        </h1>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-9 mb-9">
          <div id="OauthContainer" className="flex gap-5">
            <button
              type="button"
              onClick={onGoogle}
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image src="/google.svg" alt="google-logo" width={28} height={28} priority={false} />
              <p className="text-white">{t("oauth.google")}</p>
            </button>
            <button
              type="button"
              onClick={onDiscord}
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image src="/discord.svg" alt="discord-logo" width={28} height={28} priority={false} />
              <p className="text-white">{t("oauth.discord")}</p>
            </button>
          </div>

          <Separator>
            <SeparatorLine />
            <SeparatorWord>{t("oauth.orLogInWith")}</SeparatorWord>
          </Separator>
        </div>

        {/* form fields */}
        <div id="formFieldContainer" className="flex flex-col gap-[43px] mb-[15px]">
          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="text"
              placeholder={t("fields.email.placeholder")}
              className="text-white bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            />
            {errors.email && <p className="text-sm text-white mt-3">{errors.email.message || t("fields.email.error")}</p>}
          </div>

          {/* Password */}
          <div>
            <div id="PasswordField" className="relative h-[45px]">
              <input
                {...register("password")}
                type={show ? "text" : "password"}
                placeholder={t("fields.password.placeholder")}
                className="absolute inset-0 z-0 text-white bg-form-input rounded-md w-full px-[18px] pr-[55px] focus:outline-none focus:outline-form-border"
              />
              <EyeToggle show={show} setShow={setShow} />
            </div>
            {errors.password && <p className="text-sm text-white mt-3">{errors.password.message || t("fields.password.error")}</p>}
          </div>
        </div>

        {/* Register prompt */}
        <p className="text-[14px] text-form-muted mb-[40px]">
          {t("registerPrompt")}
          <Link href="/register" className="underline text-form-link hover:text-form-link-accent ml-1">
            {t("registerLink")}
          </Link>
        </p>

        {/* Submit button */}
        <div id="formActions" className="flex flex-col gap-7">
          <button
            disabled={isSubmitting || isLoading}
            className="flex justify-center items-center gap-2 bg-form-button rounded-md text-white px-[18px] h-11 w-full hover:bg-form-button-accent transition-all duration-300"
          >
            {isSubmitting && <Spinner className="w-7 h-7" />}
            {t("buttons.login")}
          </button>
        </div>
      </form>
    </div>
  );
}
