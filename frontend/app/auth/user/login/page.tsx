"use client";

import Link from "next/link";
import GoogleLogin from "../../../features/auth/google-login";
import Logo from "../../../components/elements/icons/Logo";
import Separator from "../../../components/elements/others/separator";
import UserLogin from "../../../features/auth/user-login";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="w-[312px] h-auto min-h-[520px] rounded-[10px] bg-[#181818] py-6
          flex flex-col items-center justify-around space-y-4 shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
      >
        <div className="my-8">
          <Logo />
        </div>
        <GoogleLogin />
        <Separator />
        <UserLogin />
        <Link href={"/auth/user/register"} className="text-[#3d91ff]">
          アカウントをお持ちでない方
        </Link>
      </div>
    </div>
  );
}
