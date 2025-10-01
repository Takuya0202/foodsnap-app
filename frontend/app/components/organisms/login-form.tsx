import Link from "next/link";
import GoogleLogin from "../atoms/buttons/google-button";
import Logo from "../atoms/icons/Logo";
import SeparateBar from "../atoms/others/separate-bar";
import UserLogin from "../molecules/forms/user-login";

export default function LoginForm() {
  return (
    <div
      className="w-[312px] h-auto min-h-[520px] rounded-[10px] bg-[#181818] py-6
        flex flex-col items-center justify-around space-y-4 shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="my-8">
        <Logo />
      </div>
      <GoogleLogin />
      <SeparateBar />
      <UserLogin />
      <Link href={"/user/register"} className="text-[#3d91ff]">
        アカウントをお持ちでない方
      </Link>
    </div>
  );
}
