"use client";

import { useCommentStore } from "@/app/zustand/comment";
import { ChatBubbleOutline, Close } from "@mui/icons-material";
import "./animation.css";
import Image from "next/image";
import CreateComment from "../../../features/store/createComment";
import { useState } from "react";

type Props = {
  storeId: string;
  commentCount: number;
};

export default function CommentModal({ storeId, commentCount }: Props) {
  const { isOpen, isLoading, comments, currentStoreId, closeComment } = useCommentStore();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      closeComment();
    }
  };

  // このストアのモーダルかどうか
  if (!isOpen || currentStoreId !== storeId) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 w-full h-[65%] z-[200]">
      <div
        className={`w-full h-full bg-[#181818] rounded-tl-3xl rounded-tr-3xl flex flex-col
        ${isClosing ? "animate-[slideOutBottom_0.3s_ease-in-out]" : "animate-[slideInBottom_0.3s_ease-in-out]"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-center space-x-10 py-3 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between w-[80%]">
            <h2 className="text-white font-semibold">コメント {commentCount}件</h2>
            <button onClick={handleClose}>
              <Close sx={{ color: "#b7b7b7", width: 24, height: 24 }} />
            </button>
          </div>
        </div>

        {/* コメント一覧 */}
        <div className="flex-1 overflow-y-scroll px-4 py-4">
          {comments?.map((comment) => (
            <div key={comment.id}>
              <div className="flex items-start space-x-3 py-4">
                {/* ユーザーアイコン */}
                <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={comment.userIcon || "/default-icon.svg"}
                    alt={comment.userName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* コメント内容 */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{comment.userName}</span>
                    <span className="text-[#888] text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* ローディングスケルトン */}
          {isLoading && (
            <div className="flex items-start space-x-3 py-4">
              <div className="w-10 h-10 rounded-full bg-skLoading flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-4 bg-skLoading rounded"></div>
                  <div className="w-16 h-3 bg-skLoading rounded"></div>
                </div>
                <div className="w-full h-12 bg-skLoading rounded"></div>
              </div>
            </div>
          )}

          {/* コメントが0件の場合 */}
          {!isLoading && comments?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <ChatBubbleOutline sx={{ color: "#b7b7b7", width: 48, height: 48 }} />
              <p className="text-[#b7b7b7] text-sm">まだコメントがありません</p>
            </div>
          )}
        </div>
        {/* コメントフォーム */}
        <div>
          <CreateComment storeId={storeId} />
        </div>
      </div>
    </div>
  );
}
