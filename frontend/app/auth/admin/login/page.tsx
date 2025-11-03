import LinkButton from "@/app/components/elements/buttons/link-button";
import Logo from "@/app/components/elements/icons/Logo";
import PrivacyPolicy from "@/app/components/elements/others/privacyPolicy";
import ServiceTerm from "@/app/components/elements/others/serviceTerm";
import AdminLoginForm from "@/app/features/auth/admin-login-form";

export default function AdminLogin() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div
        className="w-[70%] max-w-[640px] h-full min-h-[520px] rounded-[10px] bg-[#181818] p-6
        flex items-center space-y-4 shadow-form justify-between"
      >
        <div className="h-full flex items-center justify-center w-1/2">
          <Logo fontSize={32} />
        </div>
        <div className="flex flex-col items-center space-y-8 h-full justify-between w-1/2">
          <h1 className="text-white text-[24px]">店舗管理者ログイン</h1>
          <AdminLoginForm />
          <div className="flex flex-col items-center space-y-6">
            <LinkButton href="/auth/admin/register" className="text-sm">
              新規店舗登録はこちら
            </LinkButton>
            <div className="w-full flex justify-end">
              <LinkButton href="/auth/reset-password" className="text-sm ">
                パスワードを忘れた方はこちら
              </LinkButton>
            </div>
            <LinkButton href="/stores/top" className="text-sm">
              ユーザー画面へ
            </LinkButton>
            <div className="w-full flex justify-between items-center">
              <PrivacyPolicy />
              <ServiceTerm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
