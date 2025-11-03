import LinkButton from "../../components/elements/buttons/link-button";

export default function ErrorPage() {
  return (
    <div className="flex imtes-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-4 ">
        <h1 className="text-white text-[24px]">
          認証エラーが発生しました。もう一度お試しください。
        </h1>
        <LinkButton href="/auth/user/login">ログインページへ戻る</LinkButton>
      </div>
    </div>
  );
}
