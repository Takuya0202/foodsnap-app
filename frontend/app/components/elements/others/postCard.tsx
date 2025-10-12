"use client";
import Image from "next/image";

type props = {
  id: string;
  name: string;
  price: number;
  photo: string;
};

const handleEdit = (id: string) => {
  // 編集処理
};
export function PostCardSkeleton() {
  return (
    <div className="bg-[#1e1e1e] w-[400px] h-[440px] rounded-2xl flex flex-col">
      <div className="h-[240px] bg-skLoading m-6"></div>
      <div className="flex items-center justify-between px-6">
        <div className="w-[100px] h-[24px] bg-skLoading"></div>
        <div className="w-[100px] h-[24px] bg-skLoading"></div>
      </div>
    </div>
  );
}
export function PostCardContetnt({ id, name, price, photo }: props) {
  return (
    <div className="bg-[#1e1e1e] w-[400px] h-[440px] rounded-2xl flex flex-col space-y-4">
      <Image src={photo} alt={name} width={360} height={240} className="object-cover" />
      <div className="flex items-center justify-between px-6">
        <p className="text-white text-[16px] font-bold">{name}</p>
        <p className="text-white text-[16px] font-bold">{price}</p>
      </div>
      <div className="w-full mx-auto">
        <button className="bg-[#FF833C] py-2 px-[60px] text-white" onClick={() => handleEdit(id)}>
          編集する
        </button>
      </div>
    </div>
  );
}
