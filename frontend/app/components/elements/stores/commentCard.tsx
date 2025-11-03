import Image from "next/image";

// 詳細ページでコメントを表示するコンポーネント
type props = {
  userName: string;
  userIcon: string | null;
  content: string;
  createdAt: string;
};

// スケルトン表示用
export function CommentCardSkeleton() {
  return (
    <div className="w-[256px] h-[224px] flex flex-col items-start space-y-2 p-4 rounded-2xl bg-[#181818] shrink-0">
      <div className="w-full flex items-center space-x-4">
        <div className="w-[32px] h-[32px] rounded-full bg-skLoading"></div>
        <div className="w-[100px] h-[20px] bg-skLoading"></div>
      </div>

      {/* 日付 */}
      <div className="w-full flex justify-end">
        <div className="w-[80px] h-[16px] bg-skLoading"></div>
      </div>

      {/* コメント内容 */}
      <div className="w-full">
        <div className="w-full h-[80px] bg-skLoading"></div>
      </div>
    </div>
  );
}

// コンテンツ表示用
export function CommentCardContent({ userName, userIcon, content, createdAt }: props) {
  return (
    <div className="w-[256px] h-[224px] flex flex-col items-start space-y-2 p-4 rounded-2xl bg-[#181818] overflow-y-auto shrink-0">
      <div className="w-full flex items-center space-x-4">
        <div className="relative w-[32px] h-[32px] rounded-full">
          <Image
            src={userIcon || "/default-icon.svg"}
            alt={`${userName}のアイコン`}
            fill
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <p className="text-white flex-1 whitespace-nowrap overflow-x-hidden">{userName}</p>
      </div>

      {/* 日付 */}
      <p className="text-sm text-[#7e7e7e] w-full text-right">
        {new Date(createdAt).toLocaleDateString()}
      </p>

      {/* コメント内容 */}
      <p className="text-white">{content}</p>
    </div>
  );
}
