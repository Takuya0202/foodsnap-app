import GoogleLogin from "../atoms/buttons/google-button";
import Logo from "../atoms/others/Logo";
import SeparateBar from "../atoms/others/separate-bar";
import UserLogin from "../molecules/forms/user-login";

export default function LoginForm() {
  return (
    <div
      className="w-[312px] h-auto rounded-[10px] bg-[#181818] py-6
        flex flex-col items-center space-y-8 shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <Logo />
      <GoogleLogin />
      <SeparateBar />
      <UserLogin />
    </div>
  );
}
