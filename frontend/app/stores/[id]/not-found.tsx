import LinkButton from "@/app/components/elements/buttons/link-button";

export default function NotFound() {
  return (
    <div>
      <h1>Oops... 店舗が見つかりませんでした。</h1>
      <LinkButton href="/stores/top">トップページへ戻る</LinkButton>
    </div>
  );
}
