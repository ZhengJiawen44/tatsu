// app/register/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { registrationSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Separator, SeparatorLine, SeparatorWord } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { RegisterFormProp } from "@/types";
import { useState } from "react";
import EyeToggle from "@/components/ui/eyeToggle";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();
  const { toast } = useToast();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<RegisterFormProp>({ resolver: zodResolver(registrationSchema) });

  async function onGoogle() {
    try {
      const result = await signIn("google", { callbackUrl: "/app/todo" });
      if (result?.error) {
        toast({ title: t("toasts.googleError") });
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({ title: t("toasts.googleError") });
    }
  }

  async function onDiscord() {
    try {
      const result = await signIn("discord", { callbackUrl: "/app/todo" });
      if (result?.error) {
        toast({ title: t("toasts.discordError") });
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({ title: t("toasts.discordError") });
    }
  }

  async function onSubmit(data: RegisterFormProp) {
    try {
      const res = await fetch("/api/auth/register", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      const { message } = body;
      toast({ title: message });
      if (res.ok) router.push("/login");
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
        {/* Header */}
        <h1 className="text-[35px] md:text-[38px] lg:text-[45px] text-white mb-[37px]">
          {t("title")}
        </h1>
        <p className="text-[14px] text-form-muted mb-[40px]">
          {t("loginPrompt")}
          <Link
            href="/login"
            className="underline text-form-link hover:text-form-link-accent ml-1"
          >
            {t("loginLink")}
          </Link>
        </p>

        {/* Form Fields */}
        <div id="formFieldContainer" className="flex flex-col gap-[43px] mb-[50px]">
          <div id="nameFieldContainer" className="flex gap-5">
            <div className="w-[50%]">
              <input
                {...register("fname")}
                type="text"
                className="text-white w-full bg-form-input rounded-md h-[45px] px-[18px] focus:outline-hidden focus:outline-form-border"
                placeholder={t("fields.fname.placeholder")}
              />
              {errors.fname && (
                <p className="text-sm text-white mt-3">{errors.fname.message}</p>
              )}
            </div>
            <div className="w-[50%]">
              <input
                {...register("lname")}
                type="text"
                className="text-white w-full bg-form-input rounded-md h-[45px] px-[18px] focus:outline-hidden focus:outline-form-border"
                placeholder={t("fields.lname.placeholder")}
              />
              {errors.lname && (
                <p className="text-sm text-white mt-3">{errors.lname.message}</p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register("email")}
              type="text"
              className="text-white bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-hidden focus:outline-form-border"
              placeholder={t("fields.email.placeholder")}
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
                className="absolute inset-0 z-0 text-white bg-form-input rounded-md w-full px-[18px] pr-[55px] focus:outline-hidden focus:outline-form-border"
                placeholder={t("fields.password.placeholder")}
              />
              <EyeToggle show={show} setShow={setShow} />
            </div>
            {errors.password && (
              <p className="text-sm text-white mt-3">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div id="formActions" className="flex flex-col gap-7">
          <button
            disabled={isSubmitting || isLoading}
            className="flex justify-center items-center gap-2 bg-form-button rounded-md text-white px-[18px] h-11 w-full hover:bg-form-button-accent transition-all duration-300"
          >
            {isSubmitting && <Spinner className="w-7 h-7" />}
            {t("buttons.register")}
          </button>

          <Separator>
            <SeparatorLine />
            <SeparatorWord>{t("oauth.orRegisterWith")}</SeparatorWord>
          </Separator>

          <div id="OauthContainer" className="flex gap-5">
            <button
              onClick={onGoogle}
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-12 border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image src="/google.svg" alt="google-logo" width={28} height={28} />
              <p className="text-white">{t("oauth.google")}</p>
            </button>
            <button
              onClick={onDiscord}
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-12 border border-form-border rounded-md hover:border-form-border-accent transition-all duration-300"
            >
              <Image src="/discord.svg" alt="discord-logo" width={28} height={28} />
              <p className="text-white">{t("oauth.discord")}</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}