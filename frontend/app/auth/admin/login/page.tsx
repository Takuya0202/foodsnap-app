import LinkButton from "@/app/components/elements/buttons/link-button";
import Logo from "@/app/components/elements/icons/Logo";
import AdminLoginForm from "@/app/features/auth/admin-login-form";

export default function AdminLogin() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div
        className="w-[70%] max-w-[640px] h-full min-h-[520px] rounded-[10px] bg-[#181818] p-6
        flex items-center space-y-4 shadow-[6px_4px_4px_rgba(0,0,0,0.25)] justify-between"
      >
        <div className="h-full flex items-center justify-center w-1/2">
          <Logo />
        </div>
        <div className="flex flex-col items-center space-y-8 h-full justify-between w-1/2">
          <h1 className="text-white text-[24px]">店舗管理者ログイン</h1>
          <AdminLoginForm />
          <div className="flex flex-col items-center space-y-6">
            <LinkButton href="/auth/admin/register">新規店舗登録はこちら</LinkButton>
            <LinkButton href="/stores/top">ユーザー画面へ</LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
