"use client";
import { useState } from "react";
import { DeleteForever } from "@mui/icons-material";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";

export default function UserDelete() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { open } = useToaster();

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await client.api.user.delete.$delete();
      if (res.status === 200) {
        open("アカウント削除しました", "success");
        router.push("/auth/user/login");
      } else {
        const data = await res.json();
        open(data.error, "error");
      }
    } catch {
      open("削除に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 削除ボタン */}
      <button
        className="flex items-center gap-2 p-1.5 rounded-[#6px] hover:outline"
        onClick={() => setIsOpen(true)}
      >
        <DeleteForever sx={{ color: "#ff0000", width: "32px", height: "32px" }} />
        <span className="text-[#ff0000]">アカウント削除</span>
      </button>

      {/* 確認モーダル */}
      {isOpen && (
        <div className="flex justify-center items-center bg-[rgba(0,0,0,0.6)] w-full h-full">
          <div
            className="flex flex-col bg-[#181818] w-[86%] mx-auto rounded-[6px] p-4
            shadow-[6px_4px_4px_rgba(0,0,0,0.25)]"
          >
            <div>
              <h1 className="text-[#ff0000] text-lg font-bold">警告</h1>
            </div>

            <div>
              <p className="text-[#b7b7b7] text-sm">
                アカウントを削除すると、ユーザー情報が完全に削除され、復元することができません。
                <br />
                本当に削除しますか？
              </p>
            </div>

            <div className="flex justify-between gap-2 items-center">
              <button
                className="flex items-center gap-2 p-1.5 rounded-[#6px] hover:outline"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <span className="text-[#ff0000]">
                  {isSubmitting ? "削除中..." : "アカウント削除"}
                </span>
              </button>
              <button
                className="text-[#3d91ff] text-sm"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
