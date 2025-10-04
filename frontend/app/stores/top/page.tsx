import Link from "next/link";
import UserLogout from "../../features/auth/logout";

export default function TopPage() {
  return (
    <div>
      <h1>TopPage</h1>
      <Link href="/user/profile">ステータス確認</Link>
      <UserLogout />
    </div>
  );
}
