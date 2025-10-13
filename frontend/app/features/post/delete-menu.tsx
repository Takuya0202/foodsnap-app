"use client";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { DeleteForever } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

type props = {
  id : string;
}
export default function DeleteMenu({ id } : props) {
  const [isOpen , setIsOpen ] = useState<boolean>(false);
  const [isSubmitting , setIsSubmitting ] = useState<boolean>(false);
  const router = useRouter();
  const { open } = useToaster();

  // 削除
  const handleDelete = async (id : string) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.post[":postId"].delete.$delete({
        param : {
          postId : id,
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        open(data.message , "success");
        router.push("/admin/dashboard");
      }
      else {
        const data = await res.json();
        open(data.error , "error");
      }
    } catch{
      open("通信に失敗しました。" , "error");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 w-full p-3 rounded-lg hover:bg-[#262626] transition-colors">
        <DeleteForever sx={{ color: "#ff0000", width: "24px", height: "24px" }} />
        <span className="text-[#ff0000] text-base">投稿削除</span>
      </button>
      {
        isOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-[60]">
            <div className="flex flex-col bg-[#181818] w-[86%] max-w-[640px] mx-auto rounded-[6px] px-4 py-6 shadow-[6px_4px_4px_rgba(0,0,0,0.25)] text-white
            items-center space-y-8">
              <div className="text-3xl font-bold">
                投稿を削除しますか？
              </div>
              <div className="flex items-center w-[40%] justify-between">
                <button onClick={() => handleDelete(id)} disabled={isSubmitting}>
                  <span className="text-[#ff0000]">
                    {isSubmitting ? "削除中..." : "削除"}
                  </span>
                </button>
                <button onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  <span className="text-[#3d91ff]">キャンセル</span>
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}