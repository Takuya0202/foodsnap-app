"use client";
import { useStoreModal } from "@/app/zustand/storeModal";
import { storeResponse } from "@/types/store";
import Image from "next/image";
import { useEffect } from "react";

// 一覧ページやいいねなど、概要を表時。タップすることでtopと同じモーダルを表示する
type props = {
  stores: storeResponse;
};

export default function StoreCard({ stores }: props) {
  const { setStores, openModal } = useStoreModal();
  useEffect(() => {
    setStores(stores);
  }, [stores , setStores]);


  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {stores.map((store) => (
        <div 
          className="w-full flex flex-col items-start space-y-2 cursor-pointer 
                     transition-transform duration-200 hover:scale-105" 
          key={store.id} 
          onClick={() => openModal(store.id)}
        >
          <div className="relative w-[160px] h-[120px] rounded-md overflow-hidden shadow-lg">
            <Image
              src={store.photo || "/default-photo.jpg"}
              alt={store.name}
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
  );
}
