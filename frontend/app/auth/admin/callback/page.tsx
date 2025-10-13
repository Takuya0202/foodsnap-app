"use client";
import EmailCallback from "@/app/features/auth/email-callback";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function AdminCallback() {
  const { open } = useToaster();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // パラメータの取得
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");

    if (!codeParam) {
      open("認証情報が取得できませんでした", "error");
      router.push("/auth/admin/login");
    }

    setCode(codeParam);
  }, [open, router]);

  useEffect(() => {
    if (!code) return;

    // 管理者本登録
    async function callbackAdmin() {
      try {
        const res = await client.api.auth.admin.callback.$post(
          {},
          {
            headers: {
              authorization: `Bearer ${code}`,
            },
          }
        );
        if (res.status === 200) {
          open("管理者本登録が完了しました", "success");
          window.location.href = "/admin/dashboard";
        } else {
          const data = await res.json();
          open(data.error, "error");
        }
      } catch {
        open("ネットワークエラーが発生しました", "error");
        router.push("/auth/admin/login");
      }
    }
    callbackAdmin();
  }, [code, open, router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <EmailCallback />
    </div>
  );
}
