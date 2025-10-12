"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type props = {
  id: string;
  name: string;
  price: number;
  photo: string;
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
  const router = useRouter();
  const handleEdit = (id: string) => {
    router.push(`/admin/post/${id}/edit`);
  };
  return (
    <div className="bg-[#1e1e1e] w-[400px] rounded-2xl flex flex-col h-[440px]">
      <div className="relative h-[200px] mx-6 my-6">
        <Image src={photo} alt={name} fill className="object-cover" />
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-white text-[36px]">{name}</p>
        <p className="text-white text-[36px]">
          {price}
          <span className="pl-2">円</span>
        </p>
      </div>

      <div className="flex justify-center pb-6 flex-1 items-end">
        <button
          className="bg-[#FF833C] py-2 px-[60px] text-white rounded-lg hover:bg-[#FF9D5C] transition-colors h-[40px]"
          onClick={() => handleEdit(id)}
        >
          編集する
        </button>
      </div>
    </div>
  );
}
