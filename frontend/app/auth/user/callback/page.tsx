"use client";
import Callback from "@/app/components/organisms/callback";
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
      router.push("/user/login");
    }
    
    setCode(codeParam);
  }, [open, router]);

  useEffect(() => {
    if (!code) return;

    async function callbackUser() {
      try {
        const res = await client.api.auth.user.callback.$post(
            {}, // 第二引数は必須。リクエストボディ。これがわかるのに2時間かかった。くそ
            {
          headers: {
            'authorization': `Bearer ${code}`
          }
        });
        
        if (res.status === 200) {
          open("ユーザー登録が完了しました", "success");
          router.push("/stores/top");
        } else {
          const data = await res.json();
          open(data.error, "error");
        }
      } 
      catch (e) {
        open("ネットワークエラーが発生しました", "error");
        router.push("/user/login");
      }
    }
    
    callbackUser();
  }, [code, open, router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Callback/>
    </div>
  );
}