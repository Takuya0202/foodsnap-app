"use client";
import { useSendEmail } from "@/app/zustand/register";

export default function SendEmail() {
  const { email, setIsSend } = useSendEmail();
  return (
    <div
      className="w-[312px] h-auto min-h-[400px] rounded-[10px] bg-[#181818] py-6
      flex flex-col items-center shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="flex flex-col items-center justify-between w-[80%] mx-auto">
        <h1 className="text-[24px] font-bold text-white">{email}</h1>
        <p className="text-[20px] text-white">にメールを送信いたしました。</p>
        <p className="text-[20px] text-white">
          送信したメールにアクセスし、ユーザー登録を完了してください。
        </p>
        <button className="text-[#3d91ff]" onClick={() => setIsSend(false)}>
          登録フォームに戻る
        </button>
      </div>
    </div>
  );
}
