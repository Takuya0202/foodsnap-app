"use client";
import RegisterForm from "@/app/components/organisms/register-form";
import SendEmail from "@/app/components/organisms/sendEmail";
import { useSendEmail } from "@/app/zustand/register";

export default function Register() {
  const { isSend } = useSendEmail();
  return (
    <div className="flex items-center justify-center h-screen">
      {isSend ? <SendEmail /> : <RegisterForm />}
    </div>
  );
}
