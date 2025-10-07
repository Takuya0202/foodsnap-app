import LinkButton from "../../components/elements/buttons/link-button";

export default function ErrorPage() {
  return (
    <div>
      <h1>認証エラーが発生しました。もう一度お試しください。</h1>
      <LinkButton href="/user/login">ログインページへ戻る</LinkButton>
    </div>
  );
}
