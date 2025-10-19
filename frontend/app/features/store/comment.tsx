"use client";

import { useToaster } from "@/app/zustand/toaster";
import { commentResponse } from "@/types/store";
import { client } from "@/utils/setting";
import { ChatBubbleOutline } from "@mui/icons-material";
import { useState } from "react";

type props = {
  storeId: string;
  commentCount: number;
};
export default function Comment({ storeId, commentCount }: props) {
  const [comments, setComments] = useState<commentResponse>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { open } = useToaster();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
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
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isOpen ? (
        <div>
            
        </div>
      ) : (
        <button className="flex items-center flex-col space-y-1" onClick={handleOpen}>
          <ChatBubbleOutline sx={{ color: "white", width: 36, height: 36 }} />
          <span className="text-white text-sm">{commentCount}</span>
        </button>
      )}
    </div>
  );
}
