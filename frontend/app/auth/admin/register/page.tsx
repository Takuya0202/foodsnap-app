"use client";
import AdminRegisterForm from "@/app/features/auth/admin-register-form";
import { useState } from "react";
import EmailConfirmation from "@/app/features/auth/email-confirmation";
import LinkButton from "@/app/components/elements/buttons/link-button";
export default function AdminRegister() {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setIsSent(true);
  };

  const handleBack = () => {
    setIsSent(false);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      {isSent ? (
        <EmailConfirmation email={email} onBack={handleBack} />
      ) : (
        <div
          className="w-[80%] max-w-[640px] p-6 bg-[#181818] rounded-[10px] shadow-form 
      flex flex-col items-center space-y-4 my-10"
        >
          <h1 className="my-8 text-white text-[32px]">新規店舗登録</h1>
          <AdminRegisterForm onEmailSent={handleEmailSent} />
          <LinkButton href="/auth/admin/login" className="mb-2">
            既にアカウントをお持ちの方
          </LinkButton>
        </div>
      )}
    </div>
  );
}
