"use client";

import { useStoreModal } from "@/app/zustand/storeModal";
import { useUser } from "@/app/zustand/user";
import { useEffect } from "react";
import Image from "next/image";

// いいねした店舗一覧を表示するコンポーネント
export default function StoreLikes() {
  const { openModal , setStores } = useStoreModal();
  const { likeStores } = useUser();
  useEffect(() => {
    setStores(likeStores);
  }, [likeStores , setStores]);

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {likeStores.map((store) => (
        <div 
          className="w-full flex flex-col items-start space-y-2 cursor-pointer 
                     transition-transform duration-200 hover:scale-105" 
          key={store.id} 
          onClick={() => openModal(store.id)}
        >
          <div className="relative w-[160px] h-[120px] rounded-md overflow-hidden shadow-lg">
            <Image
              src={store.photo || store.posts[0].photo || "/default-photo.jpg"}
              alt={store.name || store.posts[0].name || "店舗名"}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-full justify-end">
            <p className="text-white font-semibold text-sm line-clamp-2">{store.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}