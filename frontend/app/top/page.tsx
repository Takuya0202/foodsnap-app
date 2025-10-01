import Link from "next/link";
import LogoutButton from "../components/atoms/buttons/logout-button";
export default function TopPage() {
  return (
    <div>
      <h1>TopPage</h1>
      <Link href="/user">ステータス確認</Link>
      <LogoutButton />
    </div>
  );
}
