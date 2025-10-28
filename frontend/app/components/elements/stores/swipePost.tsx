"use client";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Favorite, Share, Room, Store, ChatBubbleOutline } from "@mui/icons-material";
import { useState } from "react";
import Like from "@/app/features/store/like";
import Link from "next/link";
import CommentButton from "@/app/features/store/commentButton";
import ShareButton from "@/app/features/store/shareButton";
import BelongFeature from "./belongFeature";

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
    <div className="w-full flex flex-col">
      <div className="w-full h-[300px] bg-skLoading rounded-md mb-2" />

      <div className="flex items-center justify-between pl-4 w-full mt-4">
        {/* 店舗、投稿の情報*/}
        <div className="w-[80%] flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-32 h-7 bg-skLoading rounded" />
            <div className="w-20 h-7 bg-skLoading rounded" />
          </div>

          <div>
            <div className="w-24 h-10 bg-skLoading rounded-2xl" />
          </div>

          <div className="flex items-center space-x-2">
            <Store sx={{ color: "#b7b7b7", width: 24, height: 24 }} />
            <div className="w-36 h-6 bg-skLoading rounded" />
          </div>

          <div className="flex items-center space-x-2">
            <Room sx={{ color: "#b7b7b7", width: 24, height: 24 }} />
            <div className="w-48 h-5 bg-skLoading rounded" />
          </div>
        </div>

        {/* いいね、コメント、共有 */}
        <div className="w-[20%] flex flex-col space-y-2 items-center">
          <div className="flex flex-col items-center space-y-1">
            <Favorite sx={{ color: "#b7b7b7", width: 36, height: 36 }} />
            <div className="w-6 h-4 bg-skLoading rounded" />
          </div>

          <div className="flex flex-col items-center space-y-1">
            <ChatBubbleOutline sx={{ color: "white", width: 36, height: 36 }} />
            <div className="w-6 h-4 bg-skLoading rounded" />
          </div>

          <div className="flex flex-col items-center space-y-1">
            <Share sx={{ color: "white", width: 36, height: 36 }} />
            <div className="w-8 h-4 bg-skLoading rounded" />
          </div>
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

  const currentPost = posts[currentPostIndex];

  return (
    <div className="w-full flex flex-col relative">
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

      <div className="flex items-center justify-between pl-4 w-full mt-4">
        {/* 店舗、投稿の情報 */}
        <div className="w-[80%] flex flex-col space-y-6">
          {/* メニュー名、価格*/}
          <div className="flex items-center justify-between ">
            <div className="flex items-center w-full justify-between">
              <h2 className="text-white text-[18px] font-semibold">{currentPost?.name}</h2>
              <p className="text-white text-[18px] font-semibold">{currentPost?.price}円</p>
            </div>
          </div>

          {/* ジャンル */}
          <div>
            <BelongFeature>{genre}</BelongFeature>
          </div>
          {/* 店舗名 */}
          <div className="flex items-center space-x-2">
            <Store sx={{ color: "#b7b7b7", width: 24, height: 24 }} />
            <Link href={`/stores/${id}`}>
              <span className="text-white text-lg">{name}</span>
            </Link>
          </div>

          {/* 住所 */}
          <div className="flex items-center space-x-2">
            <Room sx={{ color: "#b7b7b7", width: 24, height: 24 }} />
            <p className="text-[#b7b7b7] ">{address}</p>
          </div>
        </div>

        {/* いいね、コメント、共有 */}
        <div className="w-[20%] flex flex-col space-y-4 items-center">
          <Like storeId={id} likeCount={likeCount} isLiked={currentLike} />
          <CommentButton storeId={id} commentCount={commentCount} />
          <ShareButton name={currentPost?.name} id={id} />
        </div>
      </div>
    </div>
  );
}
