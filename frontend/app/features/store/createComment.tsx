"use client";
import { useCommentStore } from "@/app/zustand/comment";
import { useToaster } from "@/app/zustand/toaster";
import { CreateCommentRequest } from "@/schema/store";
import { client } from "@/utils/setting";
import { useState } from "react";

type props = {
  storeId: string;
};
export default function CreateComment({ storeId }: props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const { open } = useToaster();
  const { closeComment } = useCommentStore();

  const handleSubmit = async (req: CreateCommentRequest) => {
    setIsSubmitting(true);
    try {
      const res = await client.api.store[":storeId"].comments.$post({
        param: {
          storeId: storeId,
        },
        json: req,
      });

      if (res.status === 200) {
        const data = await res.json();
        setContent("");
        open(data.message, "success");
        closeComment();
      } else if (res.status === 401) {
        open("コメントを投稿するにはログインが必要です", "error");
      } else {
        const data = await res.json();
        if (data.message === "validation error") {
          const errors = data.error as unknown as Record<string, string>;
          open(errors.content, "error");
        }
      }
    } catch {
      open("通信に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="w-full bg-[#1e1e1e] py-7 px-4 flex items-center justify-between space-x-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ content });
      }}
    >
      <input
        type="text"
        className="pl-6 py-2 bg-[#3d3d3d]  placeholder:text-white text-white w-full"
        placeholder="コメント(400文字以内)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="text-white font-semibold bg-[#3c28c2] px-4 py-2 rounded-sm whitespace-nowrap"
        disabled={isSubmitting}
        style={{
          opacity: isSubmitting ? 0.5 : 1,
        }}
      >
        投稿
      </button>
    </form>
  );
}
