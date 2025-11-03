import Image from "next/image";

type props = {
  userName: string;
  userIcon?: string;
  content: string;
  createdAt: string;
};
export function CommentCardSkeleton() {
  return (
    <div className="bg-[#1e1e1e] w-[400px] h-[224px] rounded-[14px] flex flex-col space-y-4">
      <div className="m-3 flex items-center space-x-4">
        <div className="w-[30px] h-[30px] bg-skLoading rounded-full"></div>
        <div className="w-[100px] h-[24px] bg-skLoading"></div>
      </div>
      <div>
        <div className="mx-6 h-[100px] bg-skLoading"></div>
      </div>
    </div>
  );
}

export function CommentCardContent({ userName, userIcon, content, createdAt }: props) {
  return (
    <div className="bg-[#1e1e1e] w-[400px] h-[224px] rounded-[14px] flex flex-col space-y-4">
      <div className="m-3 flex items-center space-x-4">
        <Image
          src={userIcon || "/default-icon.svg"}
          alt={userName}
          width={30}
          height={30}
          className="rounded-full object-contain"
        />
        <p className="text-white text-[16px] font-bold">{userName}</p>
        <span className="text-white text-[12px]">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <div className="mx-6">
        <p className="text-white text-[16px]">{content}</p>
      </div>
    </div>
  );
}
