"use client";

import { ChatBubbleOutline } from "@mui/icons-material";
import { useCommentStore } from "@/app/zustand/comment";
import { client } from "@/utils/setting";
import { useToaster } from "@/app/zustand/toaster";

type Props = {
  storeId: string;
  commentCount: number;
};

export default function CommentButton({ storeId, commentCount }: Props) {
  const { openComment, setComments, setLoading } = useCommentStore();
  const { open } = useToaster();

  const handleOpen = async () => {
    setLoading(true);
    openComment(storeId);
    try {
      const res = await client.api.store[":storeId"].comments.$get({
        param: {
          storeId: storeId,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setComments(data);
      } else {
        const data = await res.json();
        open(data.error, "error");
      }
    } catch {
      open("通信に失敗しました。", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="flex items-center flex-col space-y-1" onClick={handleOpen}>
      <ChatBubbleOutline sx={{ color: "white", width: 36, height: 36 }} />
      <span className="text-white text-sm">{commentCount}</span>
    </button>
  );
}
