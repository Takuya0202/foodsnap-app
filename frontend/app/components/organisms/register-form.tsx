"use client";
import Link from "next/link";
import Logo from "../atoms/others/Logo";
import GoogleLogin from "../atoms/buttons/google-button";
import SeparateBar from "../atoms/others/separate-bar";
import UserRegister from "../molecules/forms/user-register";

export default function RegisterForm() {
  return (
    <div
      className="w-[312px] h-auto min-h-[400px] rounded-[10px] bg-[#181818] py-6
        flex flex-col items-center space-y-4 shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="my-8">
        <Logo />
      </div>
      <GoogleLogin />
      <SeparateBar />
      <UserRegister />
      <Link href={"/user/login"} className="text-[#3d91ff]">
        既にアカウントをお持ちの方
      </Link>
    </div>
  );
}
