"use client";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Favorite, ChatBubbleOutline, Share } from "@mui/icons-material";
import { useState } from "react";
import Like from "@/app/features/store/like";

// 店舗の投稿を表示するコンポーネント。横スワイプで次の投稿に移動する。
type props = {
  id: string;
  name: string;
  address: string;
  genre: string | null;
  likeCount: number;
  commentCount: number;
  currentLike: boolean;
  posts: {
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string | null;
  }[];
};

export function SwipePostSkeleton() {
  return (
    <div className="w-full">
      <div className="w-full h-[260px] flex flex-col items-start">
        <div className="w-full h-[260px] bg-skLoading"></div>
        <div className="w-[80%] flex items-center justify-between">
          <div className="w-20 h-6 bg-skLoading"></div>
          <div className="w-20 h-6 bg-skLoading"></div>
        </div>
      </div>
    </div>
  );
}

export function SwipePostContent({
  id,
  name,
  address,
  genre,
  likeCount,
  commentCount,
  posts,
  currentLike,
}: props) {
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // 現在表示している投稿のインデックス

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: posts[currentPostIndex]?.name,
        url: window.location.href,
      });
    }
  };

  const currentPost = posts[currentPostIndex];

  return (
    <div className="w-full flex flex-col">
      {/* 投稿画像。x軸でスワイプ */}
      <Swiper
        className="relative w-full h-[300px] mb-2"
        slidesPerView={1.1}
        centeredSlides={true}
        spaceBetween={10}
        speed={450}
        threshold={50}
        resistanceRatio={0.85}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        onSlideChange={(swiper) => setCurrentPostIndex(swiper.activeIndex)}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="relative w-full h-full">
              <Image src={post.photo} alt={post.name} fill className="object-cover rounded-md" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* いいね */}
      <div className="flex items-center justify-end px-2 mb-2">
        <Like storeId={id} likeCount={likeCount} isLiked={currentLike} />
      </div>

      {/* メニュー名・価格・コメント */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center space-x-10">
          <h2 className="text-white text-[18px] font-semibold">{currentPost?.name}</h2>
          <p className="text-white text-[18px] font-semibold">{currentPost?.price}円</p>
        </div>
        <button className="flex items-center gap-1">
          <ChatBubbleOutline sx={{ color: "#b7b7b7", fontSize: 24 }} />
          <span className="text-white text-sm">{commentCount}</span>
        </button>
      </div>

      {/* 店舗名・タグ */}
      <div className="flex items-center gap-2 px-2 mb-2">
        <span className="text-white text-sm">{name}</span>
        <span className="px-2 py-0.5 bg-[#3d3d3d] text-white text-xs rounded">{genre}</span>
      </div>

      {/* 住所・共有 */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[#b7b7b7] text-xs">{address}</p>
        <button onClick={handleShare} className="flex items-center gap-1">
          <Share sx={{ color: "#b7b7b7", fontSize: 20 }} />
          <span className="text-[#b7b7b7] text-xs">共有</span>
        </button>
      </div>
    </div>
  );
}
