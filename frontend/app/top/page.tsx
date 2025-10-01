"use client";
import { client } from "@/utils/setting";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopPage() {
  const router = useRouter();
  const handleLogout = async () => {
    const res = await client.api.auth.logout.$post();
    if (res.status == 200) {
      router.push("/login");
    } else {
      const data = await res.json();
      console.log(data.message);
    }
  };
  return (
    <div>
      <h1>TopPage</h1>
      <Link href="/user">ステータス確認</Link>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}
