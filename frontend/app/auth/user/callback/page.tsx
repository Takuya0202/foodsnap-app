"use client";
import EmailCallback from "@/app/features/auth/email-callback";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserCallbackPage() {
  const { open } = useToaster();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // クライアントサイドでURLパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");

    if (!codeParam) {
      open("認証情報が取得できませんでした", "error");
      router.push("/auth/user/login");
    }

    setCode(codeParam);
  }, [open, router]);

  useEffect(() => {
    if (!code) return;

    async function callbackUser() {
      try {
        const res = await client.api.auth.user.callback.$post(
          {},
          {
            headers: {
              authorization: `Bearer ${code}`,
            },
          }
        );

        if (res.status === 200) {
          open("ユーザー登録が完了しました", "success");
          window.location.href = "/stores/top"; // routerにすると即時cookieが反映されてない可能性ある
        } else {
          const data = await res.json();
          open(data.error, "error");
        }
      } catch {
        open("ネットワークエラーが発生しました", "error");
        router.push("/auth/user/login");
      }
    }

    callbackUser();
  }, [code, open, router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <EmailCallback />
    </div>
  );
}
