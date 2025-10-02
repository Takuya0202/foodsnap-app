import Link from "next/link";
import LogoutButton from "../../components/atoms/buttons/logout-button";
import SpUserFooter from "../../components/molecules/footer/sp-user-footer";
import SpUserHeader from "@/app/components/molecules/header/sp-user-header";
export default function TopPage() {
  return (
    <div>
      <SpUserHeader />
      <h1>TopPage</h1>
      <Link href="/user">ステータス確認</Link>
      <LogoutButton />
      <SpUserFooter />
    </div>
  );
}
