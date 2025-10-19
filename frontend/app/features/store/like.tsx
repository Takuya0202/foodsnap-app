"use client";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { Favorite } from "@mui/icons-material";
import { useState } from "react";

type props = {
  storeId: string;
  likeCount: number;
  isLiked: boolean;
};
export default function Like({ storeId, likeCount, isLiked }: props) {
  const [count, setCount] = useState(likeCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [like, setLike] = useState(isLiked);
  const { open } = useToaster();
  const handleLike = async () => {
    setIsSubmitting(false);
    try {
      const res = await client.api.store[":storeId"].like.$post({
        param: {
          storeId: storeId,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        open(data.message, "success");
        if (data.status === "like") {
          setCount(count + 1);
        } else if (data.status === "unlike") {
          setCount(count - 1);
        }
        setLike(!like);
      } else if (res.status === 401) {
        open("いいねにはログインが必要です。", "error");
      } else {
        const data = await res.json();
        open(data.error, "error");
      }
    } catch {
      open("通信に失敗しました。", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <button
      onClick={handleLike}
      className="flex items-center flex-col space-y-1"
      disabled={isSubmitting}
    >
      <Favorite
        sx={{
          color: like ? "#ff4444" : "#b7b7b7",
          width: 36,
          height: 36,
        }}
      />
      <span className="text-white text-sm">{count}</span>
    </button>
  );
}
