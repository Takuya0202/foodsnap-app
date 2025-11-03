"use client";
import LinkButton from "../../../components/elements/buttons/link-button";
import { useState } from "react";
import GoogleLogin from "@/app/features/auth/google-login";
import Logo from "@/app/components/elements/icons/Logo";
import Separator from "@/app/components/elements/others/separator";
import UserRegister from "@/app/features/auth/user-register";
import EmailConfirmation from "@/app/features/auth/email-confirmation";

export default function Register() {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail);
    setIsSent(true);
  };

  const handleBack = () => {
    setIsSent(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {isSent ? (
        <EmailConfirmation email={email} onBack={handleBack} />
      ) : (
        <div
          className="w-[312px] h-auto min-h-[520px] rounded-[10px] bg-[#181818] py-6
            flex flex-col items-center space-y-4 shadow-form justify-around"
        >
          <div className="my-8">
            <Logo />
          </div>
          <GoogleLogin />
          <Separator />
          <UserRegister onEmailSent={handleEmailSent} />
          <LinkButton href="/auth/user/login">既にアカウントをお持ちの方</LinkButton>
        </div>
      )}
    </div>
  );
}
