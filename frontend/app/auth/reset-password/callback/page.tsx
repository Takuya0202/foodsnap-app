"use client";
import { useToaster } from "@/app/zustand/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ResetPasswordCallback() {
  const { open } = useToaster();
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    if (!codeParam) {
      open("認証情報が取得できませんでした", "error");
      router.push("/auth/reset-password");
    }
    setCode(codeParam);
  } , []);


  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <div className="w-[80%] max-w-[480px] bg-[#1a1a1a] p-4 rounded-lg shadow-form
      flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-white">新しいパスワードの作成</h1>
      </div>
    </div>
  );
}