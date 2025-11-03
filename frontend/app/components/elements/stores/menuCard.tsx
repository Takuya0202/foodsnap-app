import Image from "next/image";

type props = {
  name: string;
  price: number;
  photo: string;
  description: string | null;
};

export function MenuCardSkeleton() {
  return (
    <div className="w-[256px] flex flex-col items-start space-y-4 shrink-0">
      {/* 料理の写真 */}
      <div className="w-full h-[160px] bg-skLoading"></div>

      {/* 名前と価格 */}
      <div className="w-full flex items-center justify-between">
        <div className="w-[80px] h-[24px] bg-skLoading"></div>
        <div className="w-[60px] h-[24px] bg-skLoading"></div>
      </div>

      {/* 説明 */}
      <div className="w-full">
        <div className="w-full h-[40px] bg-skLoading"></div>
      </div>
    </div>
  );
}

export function MenuCardContent({ name, price, photo, description }: props) {
  return (
    <div className="w-[256px] flex flex-col items-start space-y-4 shrink-0">
      {/* 料理の写真 */}
      <div className="w-full h-[160px] relative">
        <Image src={photo} alt={`${name}の写真`} fill className="object-cover w-full h-full" />
      </div>

      {/* 名前と価格 */}
      <div
        className="w-full flex items-center justify-between
      text-white text-xl font-semibold"
      >
        <p>{name}</p>
        <p className="flex items-center">
          <span>{price}</span>
          <span className="ml-1.5">円</span>
        </p>
      </div>

      {/* 説明。あったら表示 */}
      <div className="w-full h-[64px] overflow-y-auto">
        {description && <p className="text-base text-white">{description}</p>}
      </div>
    </div>
  );
}
