"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, Apps, Person, Settings } from "@mui/icons-material";
import { useState } from "react";
import UserConfig from "../modal/user-config";

// スマホサイズでのユーザー画面のフッター
export default function SpUser() {
  const path = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (isOpen) return <UserConfig setIsOpen={setIsOpen} />;
  return (
    <footer
      className="flex px-9 py-4 bg-[#181818] justify-between items-center w-full
    fixed bottom-0 z-50"
    >
      {/* topページボタン */}
      <button
        className="rounded-full p-2 hover:bg-[#d7d7d7] "
        onClick={() => router.push("/stores/top")}
        style={{
          backgroundColor: path === "/stores/top" ? "rgba(215, 215, 215, 0.7)" : "transparent",
        }}
      >
        <Home sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
      </button>

      {/* 一覧ページボタン */}
      <button
        className="rounded-full p-2 hover:bg-[#d7d7d7]"
        style={{
          backgroundColor: path === "/stores/index" ? "rgba(215, 215, 215, 0.7)" : "transparent",
        }}
        onClick={() => router.push("/stores/index")}
      >
        <Apps sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
      </button>

      {/* profileボタン */}
      <button
        className="rounded-full p-2 hover:bg-[#d7d7d7]"
        style={{
          backgroundColor: path === "/user/profile" ? "rgba(215, 215, 215, 0.7)" : "transparent",
        }}
        onClick={() => router.push("/user/profile")}
      >
        <Person sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
      </button>

      {/* 設定ボタン */}
      <button className="rounded-full p-2 hover:bg-[#d7d7d7]" onClick={() => setIsOpen(true)}>
        <Settings sx={{ color: "#b7b7b7", width: "32px", height: "32px" }} />
      </button>
    </footer>
  );
}
