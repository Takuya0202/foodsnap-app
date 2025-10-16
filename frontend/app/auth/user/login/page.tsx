import LinkButton from "../../../components/elements/buttons/link-button";
import GoogleLogin from "../../../features/auth/google-login";
import Logo from "../../../components/elements/icons/Logo";
import Separator from "../../../components/elements/others/separator";
import UserLogin from "../../../features/auth/user-login";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="w-[312px] h-auto min-h-[520px] rounded-[10px] bg-[#181818] py-6
          flex flex-col items-center justify-around space-y-4 shadow-form"
      >
        <div className="my-8">
          <Logo />
        </div>
        <GoogleLogin />
        <Separator />
        <UserLogin />
        <div className="flex flex-col items-center space-y-6 my-2">
          <LinkButton href="/auth/user/register">アカウントをお持ちでない方</LinkButton>
          <LinkButton href="/stores/top">ログインせずに始める</LinkButton>
        </div>
      </div>
    </div>
  );
}
